"use strict";

document.addEventListener('DOMContentLoaded', function () {

    $('body').tooltip({
        selector: '.customToolTip',
        placement: 'top'
    });

    //setting default values if local storage is empty
    settingsUtility.loadDefaultSettings();

    // populating the UI based on the local storage data
    UIUtility.populateUI();

    // Attaching events
    document.getElementById('btnSaveSettings').addEventListener('click', events.btnSaveSettingsClick);

    document.getElementById('btnAddWebSite').addEventListener('click', events.btnAddWebSiteClick);

    document.getElementById('btnAddServer').addEventListener('click', events.btnAddServerClick);

    document.getElementById('btnAddDB').addEventListener('click', events.btnAddDBClick);

    document.getElementById('btnConfirmReset').addEventListener('click', events.btnConfirmResetClick);

    document.getElementById('settingsTab').addEventListener('click', events.clearSettingsValidationMsg);

    //This event will update the UI based on the updates in the local storage
    window.addEventListener('storage', events.storageChanged);

});

var events = function () {

    var clearSettingsValidationMsg = function () {
        var lblSaveSettingsVal = document.getElementById('lblSaveSettingsVal');
        if (lblSaveSettingsVal.innerHTML == 'Updated Sucessfully') {
            lblSaveSettingsVal.innerHTML = '';
        }
    }

    var btnSaveSettingsClick = function () {

        var lblSaveSettingsVal = document.getElementById('lblSaveSettingsVal');
        lblSaveSettingsVal.classList.add('failure');
        lblSaveSettingsVal.innerHTML = '';

        var txtGolbalEmail = document.getElementById('txtGolbalEmail');
        var txtRunInterval = document.getElementById('txtRunInterval');
        var cbEnableNotifications = document.getElementById('cbEnableNotifications');

        txtGolbalEmail.classList.remove('valFailedBoder');
        txtRunInterval.classList.remove('valFailedBoder');

        var validateEmail = validationUtility.validateEmail(txtGolbalEmail.value);

        var isValid = true;

        if (validateEmail != '') {
            txtGolbalEmail.classList.add('valFailedBoder');
            lblSaveSettingsVal.innerHTML = validateEmail;
            isValid = false;
        }

        if (txtRunInterval.value < config.defaultSettings.minInterval ||
            txtRunInterval.value > config.defaultSettings.maxInterval) {

            txtRunInterval.classList.add('valFailedBoder');
            lblSaveSettingsVal.innerHTML = 'interval should be between ' +
                config.defaultSettings.minInterval +
                ' & ' + config.defaultSettings.maxInterval;
            isValid = false;
        }

        if (isValid) {
            lblSaveSettingsVal.classList.remove('failure');
            lblSaveSettingsVal.classList.add('success');
            settingsUtility.saveSettings(txtGolbalEmail.value, txtRunInterval.value, cbEnableNotifications.checked);
        }
    };

    var btnAddWebSiteClick = function () {

        document.getElementById('lblWebsiteVal').innerHTML = '';

        var websiteCount = helperUtility.getEntityCount(config.taskType.webSite);
        if (websiteCount >= config.defaultSettings.maxWebsiteCount) {
            document.getElementById('lblWebsiteVal').innerHTML = 'Maximum of ' + config.defaultSettings.maxWebsiteCount + ' sites are allowed';
            return;
        }

        UIUtility.addWebsite();
    };

    var btnAddServerClick = function () {
        UIUtility.addServer();
    };

    var btnAddDBClick = function () {
        UIUtility.addDB();
    };

    var btnConfirmResetClick = function () {
        localStorageUtility.resetLocalStorage();
        // Reloading the pluging, which will render the UI
        location.reload();
    };

    var btnConfirmResetClick = function () {
        localStorageUtility.resetLocalStorage();
        // Reloading the pluging, which will render the UI
        location.reload();
    };

    var storageChanged = function (e) {
        if (e.key != "settings") {
            var obj = localStorageUtility.retriveItem(e.key);
            UIUtility.updateStatus(e.key);
        }
    };

    return {
        btnSaveSettingsClick: btnSaveSettingsClick,
        btnAddWebSiteClick: btnAddWebSiteClick,
        btnAddServerClick: btnAddServerClick,
        btnAddDBClick: btnAddDBClick,
        btnConfirmResetClick: btnConfirmResetClick,
        storageChanged: storageChanged,
        clearSettingsValidationMsg: clearSettingsValidationMsg
    }

}();