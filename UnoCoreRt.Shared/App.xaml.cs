using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace UnoCoreRt
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    sealed partial class App : Application
    {
        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App()
        {
            ConfigureFilters(global::Uno.Extensions.LogExtensionPoint.AmbientLoggerFactory);

            this.InitializeComponent();
            this.Suspending += OnSuspending;
        }

        [DllImport("*")]
        private static unsafe extern int printf(byte* str, byte* unused);
        public struct TwoByteStr
        {
            public byte first;
            public byte second;
        }
        private static unsafe void PrintString(string s)
        {
            int length = s.Length;
            fixed (char* curChar = s)
            {
                for (int i = 0; i < length; i++)
                {
                    TwoByteStr curCharStr = new TwoByteStr();
                    curCharStr.first = (byte)(*(curChar + i));
                    printf((byte*)&curCharStr, null);
                }
            }
        }
        public static void PrintLine(string s)
        {
            PrintString(s);
            PrintString("\n");
        }

        private static object CreateInstance() => new global::UnoCoreRt.MainPage();

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used such as when the application is launched to open a specific file.
        /// </summary>
        /// <param name="e">Details about the launch request and process.</param>
        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
            PrintLine("OnLaunched");
#if DEBUG
            if (System.Diagnostics.Debugger.IsAttached)
			{
				// this.DebugSettings.EnableFrameRateCounter = true;
			}
#endif

            // var bindableType = new Uno.UI.DataBinding.BindableType(138, typeof(global::UnoCoreRt.MainPage));
            // bindableType.AddActivator(CreateInstance);
            PrintLine("OnLaunched AddActivator");

            PrintLine("OnLaunched rootFrame");

            Frame rootFrame = Windows.UI.Xaml.Window.Current.Content as Frame;

            // Do not repeat app initialization when the Window already has content,
            // just ensure that the window is active
            if (rootFrame == null)
            {
                PrintLine("OnLaunched rootFrame == null");

                // Create a Frame to act as the navigation context and navigate to the first page
                rootFrame = new Frame();

                PrintLine("OnLaunched new Frame()");

                rootFrame.NavigationFailed += OnNavigationFailed;
                PrintLine("OnLaunched NavigationFailed += OnNavigationFailed()");

                if (e.PreviousExecutionState == ApplicationExecutionState.Terminated)
                {
                    //TODO: Load state from previously suspended application
                }
                PrintLine("OnLaunched Window.Current.Content()");

                // Place the frame in the current Window
                Windows.UI.Xaml.Window.Current.Content = rootFrame;
                PrintLine("OnLaunched = rootFrame");
            }

            if (e.PrelaunchActivated == false)
            {
                PrintLine("OnLaunched PrelaunchActivated == false");
                if (rootFrame.Content == null)
                {
                    PrintLine("OnLaunched Content == null");

                    // When the navigation stack isn't restored navigate to the first page,
                    // configuring the new page by passing required information as a navigation
                    // parameter
                    rootFrame.Navigate(typeof(MainPage), e.Arguments);
                    PrintLine("OnLaunched v");

                }
                // Ensure the current window is active
                PrintLine("OnLaunched Activatev");

                Windows.UI.Xaml.Window.Current.Activate();
            }
            PrintLine("OnLaunched end");

        }

        /// <summary>
        /// Invoked when Navigation to a certain page fails
        /// </summary>
        /// <param name="sender">The Frame which failed navigation</param>
        /// <param name="e">Details about the navigation failure</param>
        void OnNavigationFailed(object sender, NavigationFailedEventArgs e)
        {
            throw new Exception($"Failed to load {e.SourcePageType.FullName}: {e.Exception}");
        }

        /// <summary>
        /// Invoked when application execution is being suspended.  Application state is saved
        /// without knowing whether the application will be terminated or resumed with the contents
        /// of memory still intact.
        /// </summary>
        /// <param name="sender">The source of the suspend request.</param>
        /// <param name="e">Details about the suspend request.</param>
        private void OnSuspending(object sender, SuspendingEventArgs e)
        {
            var deferral = e.SuspendingOperation.GetDeferral();
            //TODO: Save application state and stop any background activity
            deferral.Complete();
        }


        /// <summary>
        /// Configures global logging
        /// </summary>
        /// <param name="factory"></param>
        static void ConfigureFilters(ILoggerFactory factory)
        {
            factory
                .WithFilter(new FilterLoggerSettings
                    {
                        { "Uno", LogLevel.Warning },
                        { "Windows", LogLevel.Warning },

						// Debug JS interop
						// { "Uno.Foundation.WebAssemblyRuntime", LogLevel.Debug },

						// Generic Xaml events
						// { "Windows.UI.Xaml", LogLevel.Debug },
						// { "Windows.UI.Xaml.VisualStateGroup", LogLevel.Debug },
						// { "Windows.UI.Xaml.StateTriggerBase", LogLevel.Debug },
						// { "Windows.UI.Xaml.UIElement", LogLevel.Debug },

						// Layouter specific messages
						// { "Windows.UI.Xaml.Controls", LogLevel.Debug },
						// { "Windows.UI.Xaml.Controls.Layouter", LogLevel.Debug },
						// { "Windows.UI.Xaml.Controls.Panel", LogLevel.Debug },
						// { "Windows.Storage", LogLevel.Debug },

						// Binding related messages
						// { "Windows.UI.Xaml.Data", LogLevel.Debug },

						// DependencyObject memory references tracking
						// { "ReferenceHolder", LogLevel.Debug },
					}
                )
#if DEBUG
				.AddConsole(LogLevel.Debug);
#else
                .AddConsole(LogLevel.Information);
#endif
        }
    }
}
