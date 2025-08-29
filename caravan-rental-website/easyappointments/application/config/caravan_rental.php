<?php defined('BASEPATH') or exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Caravan Rental Configuration
|--------------------------------------------------------------------------
|
| Configuration settings specific to caravan rental functionality
|
*/

// Minimum rental duration in days
$config['caravan_min_rental_days'] = 2;

// Maximum rental duration in days (0 = no limit)
$config['caravan_max_rental_days'] = 0;

// Rental calculation unit (always 'days' for caravan rental)
$config['caravan_rental_unit'] = 'days';

// Enable daily booking mode (disables hourly time slots)
$config['caravan_daily_booking_mode'] = true;

// Allow bookings starting from next day
$config['caravan_min_advance_booking'] = 1; // days

// Caravan rental specific service duration (in minutes - represents 1 day)
$config['caravan_service_duration'] = 1440; // 24 hours = 1440 minutes

// Pure day-based booking - no time logic
$config['caravan_ignore_time'] = true;

/* End of file caravan_rental.php */
/* Location: ./application/config/caravan_rental.php */
