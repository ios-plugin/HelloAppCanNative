/*
 *  Copyright (C) 2017 The AppCan Open Source Project.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

#import "WidgetOnePseudoDelegate.h"
@implementation WidgetOnePseudoDelegate

- (id) init
{
	if (self = [super init]) {
		self.userStartReport = YES;
		self.useOpenControl = YES;
		self.useEmmControl = NO;
		self.usePushControl = YES;
		self.useUpdateControl = YES;
		self.useOnlineArgsControl = NO;
		self.useDataStatisticsControl = YES;
        self.useAuthorsizeIDControl = YES;
        self.useCloseAppWithJaibroken = NO;
        self.useRC4EncryptWithLocalstorage = YES;
        self.useUpdateWgtHtmlControl = YES;
//        self.useStartReportURL = @"http://124.193.176.35:11080/v4/";
//        self.useAnalysisDataURL = @"http://124.193.176.35:11080/analyIn/4.0/service/";
//        self.useBindUserPushURL = @"http://124.193.176.35:11080/gateway/";
        self.useStartReportURL = @"https://g.appcan.cn/v4/";
        self.useAnalysisDataURL = @"https://g.appcan.cn/analyIn/4.0/service/";
        self.useBindUserPushURL = @"https://g.appcan.cn/gateway/";
        self.useAppCanMAMURL = @"http://192.168.1.140:8080/mam/";
        self.useAppCanMCMURL = @"http://192.168.1.183:8443/mcmIn/";
        self.useAppCanMDMURL = @"http://192.168.1.183:8443/mdmIn/";
        self.useAppCanMDMURLControl = NO;
        self.useCertificatePassWord = @"123456";
        self.useCertificateControl = NO;
        self.useIsHiddenStatusBarControl = NO;
        self.useAppCanUpdateURL = @"";
        self.signVerifyControl = NO;
        
        self.useAppCanEMMTenantID = @"zyyd";
//        self.useAppCanAppStoreHost = @"http://124.193.176.35:11080/v4/";
        self.useAppCanAppStoreHost = @"https://g.appcan.cn/v4/";
        self.useAppCanMBaaSHost = @"";
        self.useAppCanIMXMPPHost = @"";
        self.useAppCanIMHTTPHost = @"";
        self.useAppCanTaskSubmitSSOHost = @"";
        self.useAppCanTaskSubmitHost = @"";
        self.validatesSecureCertificate = NO;
	}
	return self;
}


@end
