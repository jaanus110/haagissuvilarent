/* ----------------------------------------------------------------------------
 * Easy!Appointments - Online Appointment Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) Alex Tselegidis
 * @license     https://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        https://easyappointments.org
 * @since       v1.5.0
 * ---------------------------------------------------------------------------- */

/**
 * Caravan Booking Extensions - Simplified Version
 */
(function() {
    'use strict';
    
    console.log('Caravan booking script loaded! v2.0');
    
    // Force caravan mode immediately
    function forceCaravanMode() {
        console.log('Forcing caravan mode...');
        
        // Add visual indicator
        if (!document.querySelector('.caravan-debug')) {
            const debugDiv = document.createElement('div');
            debugDiv.className = 'caravan-debug';
            debugDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:5px 10px;border-radius:3px;z-index:9999;font-size:12px;';
            debugDiv.textContent = 'CARAVAN MODE ACTIVE';
            document.body.appendChild(debugDiv);
        }
        
        // Hide timezone selector
        const timezoneContainer = document.querySelector('#select-timezone');
        if (timezoneContainer) {
            const timezoneParent = timezoneContainer.closest('.mb-3');
            if (timezoneParent) {
                timezoneParent.style.display = 'none';
                console.log('Hidden timezone selector');
            }
        }
        
        // Hide time slots
        const availableHours = document.querySelector('#available-hours');
        if (availableHours) {
            availableHours.style.display = 'none';
            console.log('Hidden time slots');
            
            // Hide the label too
            const label = availableHours.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.display = 'none';
            }
        }
        
        // Add rental days input
        if (!document.querySelector('#rental-days-container')) {
            const rentalDaysHtml = `
                <div id="rental-days-container" class="mb-3" style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 0.375rem; padding: 1rem;">
                    <label for="rental-days" class="form-label" style="font-weight: 600; color: #495057;">Rental Days (minimum 2)</label>
                    <input type="number" id="rental-days" class="form-control" min="2" value="2">
                    <div class="form-text">Select the number of days you want to rent the caravan.</div>
                </div>
                <div id="end-date-display" class="mb-3" style="background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 0.375rem; padding: 0.75rem;">
                    <strong>End Date: </strong><span id="checkout-date-text">Please select start date</span>
                </div>
                <div id="total-price-display" class="mb-3" style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 0.375rem; padding: 0.75rem; font-size: 1.1rem;">
                    <strong style="color: #28a745;">Total Price: </strong><span id="total-price-text">€0.00</span>
                </div>
            `;
            
            if (availableHours) {
                availableHours.insertAdjacentHTML('beforebegin', rentalDaysHtml);
                console.log('Added rental days input');
            }
        }
        
        // Add body class
        document.body.classList.add('caravan-booking-mode');
        console.log('Added caravan-booking-mode class');
    }
    
    // Run immediately
    forceCaravanMode();
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceCaravanMode);
    }
    
    // Run after a delay to ensure everything is loaded
    setTimeout(forceCaravanMode, 1000);
    setTimeout(forceCaravanMode, 3000);
    setTimeout(forceCaravanMode, 5000);
    
    // Run periodically
    setInterval(forceCaravanMode, 5000);
    
    console.log('Caravan booking script setup complete');
})();
