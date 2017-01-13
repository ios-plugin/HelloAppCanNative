/**
 *
 *	@file   	: AppCanOptions.m  in HelloAppCanNative
 *
 *	@author 	: CeriNo
 * 
 *	@date   	: 2017/1/13
 *
 *	@copyright 	: 2017 The AppCan Open Source Project.
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


#import "AppCanConfiguration.h"

@implementation AppCanConfiguration


- (NSString *)originWidgetPath{
    return @"widget";
}

- (NSString *)documentWidgetPath{
    return @"";
}
- (NSString *)useBindUserPushURL{
    return @"";
}
- (NSString *)useCertificatePassWord{
    return @"";
}
- (NSString *)useAppCanEMMTenantID{
    return @"";
}
- (BOOL)useInAppCanIDE{
    return NO;
}

- (BOOL)userStartReport{
    return NO;
}
-(BOOL)useUpdateControl{
    return NO;
}
- (BOOL)usePushControl{
    return NO;
}
- (BOOL)useDataStatisticsControl{
    return NO;
}
- (BOOL)useRC4EncryptWithLocalstorage{
    return NO;
}
- (BOOL)useCertificateControl{
    return NO;
}
- (BOOL)useUpdateWgtHtmlControl{
    return NO;
}
- (BOOL)validatesSecureCertificate{
    return NO;
}
- (BOOL)useCloseAppWithJaibroken{
    return NO;
}



@end
