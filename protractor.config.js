exports.config = {
    capabilities: {
        'browserName': 'chrome'
    },
    specs: [
    ],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose: true
    },
    allScriptsTimeout: 1000000,

    onPrepare: function(){
        var width = 375;
        var height = 667;
        browser.driver.manage().window().setSize(width, height);
    }
};
