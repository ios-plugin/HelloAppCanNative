//
//  AppDelegate.m
//  HelloAppCanNative
//
//  Created by CeriNo on 2017/1/13.
//  Copyright © 2017年 AppCan. All rights reserved.
//

#import "AppDelegate.h"
#import <AppCanEngine/AppCanEngine.h>
#import <AppCanKit/AppCanKit.h>
#import "AppCanConfiguration.h"
#import <UserNotifications/UserNotifications.h>
@interface AppDelegate ()<UNUserNotificationCenterDelegate>

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    
    

    
    [AppCanEngine initializeWithConfiguration:[AppCanConfiguration new]];
    self.window = [UIWindow new];
    self.window.rootViewController = AppCanEngine.mainWidgetController;
    [self.window makeKeyAndVisible];
    
    if ([UIDevice currentDevice].systemVersion.floatValue >= 10) {
        [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    }
    return [AppCanEngine application:application didFinishLaunchingWithOptions:launchOptions];
}


- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    [AppCanEngine applicationWillResignActive:application];
}


- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    [AppCanEngine applicationDidEnterBackground:application];
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    [AppCanEngine applicationWillEnterForeground:application];
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    [AppCanEngine applicationDidBecomeActive:application];
}


- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    [AppCanEngine applicationWillTerminate:application];
}


- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)())completionHandler{
    [AppCanEngine application:application handleEventsForBackgroundURLSession:identifier completionHandler:completionHandler];
    
    
}



- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray * __nullable restorableObjects))restorationHandler{
    return [AppCanEngine application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
    
}


- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    
    [AppCanEngine application:app didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
    
}


- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err {
    
    [AppCanEngine application:app didFailToRegisterForRemoteNotificationsWithError:err];
    
}


- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    
    [AppCanEngine application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
    
}



- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [AppCanEngine application:application didReceiveRemoteNotification:userInfo];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    
    [AppCanEngine application:application didReceiveLocalNotification:notification];
    
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    return [AppCanEngine application:application handleOpenURL:url];
    
}

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation{
    return [AppCanEngine application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

#pragma mark - UNUserNotificationCenterDelegate

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
    
    [AppCanEngine userNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
    
}
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler{
    
    [AppCanEngine userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
    
}


@end
