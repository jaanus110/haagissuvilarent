<?php defined('BASEPATH') or exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Online Appointment Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) Alex Tselegidis
 * @license     https://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        https://easyappointments.org
 * @since       v1.0.0
 * ---------------------------------------------------------------------------- */

/**
 * Caravan Rental Library
 *
 * This library handles caravan rental specific functionality including
 * daily booking calculations, minimum rental periods, and availability checks.
 *
 * @package Libraries
 */
class Caravan_rental
{
    /**
     * CodeIgniter instance
     *
     * @var CI_Controller
     */
    protected $CI;

    /**
     * Caravan rental configuration
     *
     * @var array
     */
    protected $config;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->CI =& get_instance();
        $this->CI->load->config('caravan_rental');
        $this->config = $this->CI->config->item('caravan_rental') ?: [];
    }

    /**
     * Check if a service is configured for caravan rental
     *
     * @param array $service Service data
     * @return bool
     */
    public function is_caravan_service($service)
    {
        // Check if service duration matches caravan service duration (1440 minutes = 24 hours)
        return isset($service['duration']) && (int)$service['duration'] === 1440;
    }

    /**
     * Calculate rental duration in days
     *
     * @param string $start_datetime Start date and time
     * @param string $end_datetime End date and time
     * @return int Number of rental days
     */
    public function calculate_rental_days($start_datetime, $end_datetime)
    {
        $start = new DateTime($start_datetime);
        $end = new DateTime($end_datetime);
        $interval = $start->diff($end);
        
        return $interval->days;
    }

    /**
     * Validate rental duration meets minimum requirements
     *
     * @param string $start_datetime Start date and time
     * @param string $end_datetime End date and time
     * @return bool
     */
    public function validate_rental_duration($start_datetime, $end_datetime)
    {
        $rental_days = $this->calculate_rental_days($start_datetime, $end_datetime);
        $min_days = $this->config['caravan_min_rental_days'] ?? 2;
        
        return $rental_days >= $min_days;
    }

    /**
     * Generate daily time slots for caravan rental
     *
     * @param string $date Date in Y-m-d format
     * @return array Array of available time slots
     */
    public function get_daily_time_slots($date)
    {
        // For caravan rental, we use a dummy time slot since time is ignored
        return ['00:00'];
    }

    /**
     * Calculate end datetime for caravan rental
     *
     * @param string $start_datetime Start date and time
     * @param int $rental_days Number of rental days
     * @return string End date and time
     */
    public function calculate_end_datetime($start_datetime, $rental_days)
    {
        $start = new DateTime($start_datetime);
        $end = clone $start;
        $end->add(new DateInterval('P' . $rental_days . 'D'));
        
        // Set to end of day for pure day-based booking
        $end->setTime(23, 59, 59);
        
        return $end->format('Y-m-d H:i:s');
    }

    /**
     * Get minimum advance booking days
     *
     * @return int
     */
    public function get_min_advance_booking()
    {
        return $this->config['caravan_min_advance_booking'] ?? 1;
    }

    /**
     * Check if booking date meets advance booking requirements
     *
     * @param string $booking_date Date in Y-m-d format
     * @return bool
     */
    public function validate_advance_booking($booking_date)
    {
        $min_advance = $this->get_min_advance_booking();
        $min_date = new DateTime();
        $min_date->add(new DateInterval('P' . $min_advance . 'D'));
        
        $booking = new DateTime($booking_date);
        
        return $booking >= $min_date;
    }

    /**
     * Get available dates for caravan rental
     *
     * @param int $provider_id Provider ID
     * @param int $service_id Service ID
     * @param string $month Month in Y-m format
     * @return array Array of available dates
     */
    public function get_available_dates($provider_id, $service_id, $month)
    {
        $this->CI->load->model('appointments_model');
        
        $start_date = $month . '-01';
        $end_date = date('Y-m-t', strtotime($start_date));
        
        $existing_appointments = $this->CI->appointments_model->get([
            'id_users_provider' => $provider_id,
            'id_services' => $service_id,
            'start_datetime >=' => $start_date . ' 00:00:00',
            'start_datetime <=' => $end_date . ' 23:59:59'
        ]);
        
        $unavailable_dates = [];
        foreach ($existing_appointments as $appointment) {
            $start = new DateTime($appointment['start_datetime']);
            $end = new DateTime($appointment['end_datetime']);
            
            // Mark all dates in the rental period as unavailable
            $current = clone $start;
            while ($current < $end) {
                $unavailable_dates[] = $current->format('Y-m-d');
                $current->add(new DateInterval('P1D'));
            }
        }
        
        return array_unique($unavailable_dates);
    }

    /**
     * Validate caravan rental booking
     *
     * @param array $appointment Appointment data
     * @return array Validation result with success status and message
     */
    public function validate_booking($appointment)
    {
        $result = ['success' => true, 'message' => ''];
        
        // Check minimum rental duration
        if (!$this->validate_rental_duration($appointment['start_datetime'], $appointment['end_datetime'])) {
            $min_days = $this->config['caravan_min_rental_days'] ?? 2;
            $result['success'] = false;
            $result['message'] = "Minimum rental period is {$min_days} days.";
            return $result;
        }
        
        // Check advance booking requirement
        $booking_date = date('Y-m-d', strtotime($appointment['start_datetime']));
        if (!$this->validate_advance_booking($booking_date)) {
            $min_advance = $this->get_min_advance_booking();
            $result['success'] = false;
            $result['message'] = "Bookings must be made at least {$min_advance} day(s) in advance.";
            return $result;
        }
        
        return $result;
    }

    /**
     * Format rental period for display
     *
     * @param string $start_datetime Start date and time
     * @param string $end_datetime End date and time
     * @return string Formatted rental period
     */
    public function format_rental_period($start_datetime, $end_datetime)
    {
        $start = new DateTime($start_datetime);
        $end = new DateTime($end_datetime);
        $days = $this->calculate_rental_days($start_datetime, $end_datetime);
        
        $start_formatted = $start->format('M j, Y');
        $end_formatted = $end->format('M j, Y');
        
        return "{$start_formatted} - {$end_formatted} ({$days} days)";
    }
}

/* End of file Caravan_rental.php */
/* Location: ./application/libraries/Caravan_rental.php */
