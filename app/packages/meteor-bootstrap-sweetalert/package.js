Package.describe({
    name: 'plio:bootstrap-sweetalert',
    version: '1.0.0',

    // Brief, one-line summary of the package.
    summary: 'A beautiful (bootstrap-styled) "replacement" for JavaScript\'s alert',

    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/codechimera/meteor-bootstrap-sweetalert.git',

    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.3.4');
    api.use('ecmascript', 'client');
    api.export('swal', ['client']);

    api.addFiles([
        'dist/sweetalert.css',
        'dev/sweetalert.es6.js'
    ], ['client']);
});
