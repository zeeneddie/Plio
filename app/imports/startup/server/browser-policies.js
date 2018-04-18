import { BrowserPolicy } from 'meteor/browser-policy';

BrowserPolicy.content.allowOriginForAll('*.amazonaws.com');
BrowserPolicy.content.allowOriginForAll('*.stripe.com');
BrowserPolicy.content.allowOriginForAll('*.microsoft.com');
BrowserPolicy.content.allowFrameOrigin('*.youtube.com');
BrowserPolicy.content.allowFrameOrigin('*.vimeo.com');
BrowserPolicy.content.allowOriginForAll('fonts.googleapis.com');
BrowserPolicy.content.allowOriginForAll('fonts.gstatic.com');
BrowserPolicy.content.allowOriginForAll('graph.pliohub.com');
BrowserPolicy.content.allowFontDataUrl();
BrowserPolicy.content.allowEval();
