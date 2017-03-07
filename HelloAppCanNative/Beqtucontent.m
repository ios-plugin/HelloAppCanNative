/*
 *  Copyright (C) 2014 The AppCan Open Source Project.
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

#import "Beqtucontent.h"

@implementation Beqtucontent

static NSString *html5appcandemo = @"ba1e1402-eb3d-4c91-b8d4-ab9a3c579966";



+ (NSString *)getContentPath {
    
    if (!html5appcandemo) {
        
        return @"";
        
    }
    
    return html5appcandemo;
    
}



@end
