/*
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
*/
using System;
using System.Timers;
using System.Windows.Forms;
using System.Diagnostics;

//TODO: 
//Add core timing code, refresh after changing settings?
//Add enabled to context menu
//Some add to autostart function

namespace ChallengeReminder
{
    public partial class Form : System.Windows.Forms.Form
    {
        public Form()
        {
            InitializeComponent();
        }

        //=====Variables
        //The minute of the hour when challenge start
        private int startTime;
        //The amount of milliseconds that the notification will be shown
        private int showTime;
        //The message to display
        private string msg;
        //If it is the timer's first tick
        //On the first tick, the timer will adjust interval to 1 hour
        private bool isFirstTick;

        //=====Form Events=====
        private void Form1_Load(object sender, EventArgs e)
        {
            //Form load
            //Set textboxes length limit
            TxtStartTime.MaxLength = 2;
            TxtShowTime.MaxLength = 6;
            //Load settings
            startTime = (int)Properties.Settings.Default["startTime"];
            showTime = (int)Properties.Settings.Default["showTime"];
            msg = (string)Properties.Settings.Default["msg"];
            //Write settings into textboxes
            TxtStartTime.Text = startTime.ToString();
            TxtShowTime.Text = showTime.ToString();
            TxtMsg.Text = msg;
            //Schedule notification
            scheduleNotification();
        }
        private void Form_Shown(object sender, EventArgs e)
        {
            //Form loaded
            this.Hide();
        }

        //=====Main Mechanism=====
        private void scheduleNotification()
        {
            //Schedule the first tick, subsequent ticks are set inside tick handler
            int delay, sec, min;
            //This will be accurate to one second, which is good enough
            //Calculate the amount of seconds until next minute
            sec = 60 - DateTime.Now.Second;
            //Calculate the amount of minutes from the next minute until next challenge
            if (DateTime.Now.Minute < startTime)
            {
                //The challenge is coming in this hour
                //Minus one because we are calculating starting the next minute
                min = startTime - DateTime.Now.Minute - 1;
            }
            else
            {
                //We need to calculate how many minutes are remaining in thie hour and add start time
                //Using 59 instead of 60 because we are calculating starting the next minute
                min = 59 - DateTime.Now.Minute + startTime;
            }
            //Put minutes and seconds into milliseconds
            delay = (min * 60 + sec) * 1000;
            //Just in case we are right on the hour
            if(delay == 0)
            {
                //Set delay to an hour and display message
                delay = 3600000;
                displayMsg(showTime, msg);
            }
            //Set interval and reset timmer
            isFirstTick = true;
            MainTimer.Interval = delay;
            MainTimer.Enabled = true;
        }
        private void MainTimer_Tick(object sender, EventArgs e)
        {
            //Set interval to 1 hour
            if (isFirstTick)
            {
                //This is runned once per hour, it probably will not cause efficiency issues
                MainTimer.Interval = 3600000;
                isFirstTick = false;
            }
            //Display message
            displayMsg(showTime, msg);
        }

        //=====Tray Icon Events=====
        private void TrayShowBtn_Click(object sender, EventArgs e)
        {
            //"Show" menu item is clicked or tray icon is double-clicked
            //Show the window
            this.Show();
            //Restore the window
            this.WindowState = FormWindowState.Normal;
        }
        private void TrayExitBtn_Click(object sender, EventArgs e)
        {
            //"Exit" button is clicked
            //Exit the application
            Application.Exit();
        }

        //=====Buttons Events=====
        private void BtnHelp_Click(object sender, EventArgs e)
        {
            //Help button clicked
            //Show help message
            MessageBox.Show(
                "Challenge Start Time: The minute of the hour when the Challenge start, usually 0 or 30. The default value is 0. " + Environment.NewLine + Environment.NewLine +
                "Show Time: The amount of milliseconds that the notification will display. Minimum and maximum limit depend on your system, some system completely ignores this settings. There are 1000 milliseconds in 1 second. The default value is 5000 (5 seconds). " + Environment.NewLine + Environment.NewLine +
                "Message: The message to display. The length limit depends on your system. Click Test to see how it looks. " + Environment.NewLine + Environment.NewLine +
                "Your settings will not take effect until you press Save or Save And Hide. Clicking close button or right click tray icon then click Exit to exit the application. ",
                "Challenge Reminder Help"
            );
        }
        private void BtnTest_Click(object sender, EventArgs e)
        {
            //Test button clicked
            //Validate show time textbox
            int time;
            if (int.TryParse(TxtShowTime.Text, out time))
            {
                //Valid, show the message
               displayMsg(time, TxtMsg.Text);
            }
            else
            {
                //Not valid
                showError("Show Time", TxtShowTime);
            }
        }
        private void BtnSaveHide_Click(object sender, EventArgs e)
        {
            //Save and hide button clicked
            //Save settings and if succeed, hide main window
            if (saveSettings())
            {
                this.Hide();
            }
        }
        private void BtnSave_Click(object sender, EventArgs e)
        {
            //Save button clicked
            //Save settings
            saveSettings();
        }
        private bool saveSettings()
        {
            //Validate settings
            int i;
            //Check start time
            if (int.TryParse(TxtStartTime.Text, out i))
            {
                //Start time valid, write to variable
                startTime = i;
            }
            else
            {
                //Start time not valid
                showError("Start Time", TxtStartTime);
                return false;
            }
            //Check show time
            if (int.TryParse(TxtShowTime.Text, out i))
            {
                //Show time valid, write to variable
                showTime = i;
            }
            else
            {
                //Show time not valid
                showError("Show Time", TxtShowTime);
                return false;
            }
            //Copy message to msg variable
            msg = TxtMsg.Text;
            //Save settings for next time
            Properties.Settings.Default["startTime"] = startTime;
            Properties.Settings.Default["showTime"] = showTime;
            Properties.Settings.Default["msg"] = msg;
            Properties.Settings.Default.Save();
            //Re-schedule notification
            scheduleNotification();
            return true;
        }
        private void showError(string msg, TextBox t)
        {
            //Show an error message and focus the textbox
            MessageBox.Show("Error: " + msg + " is not valid, your settings are not saved. ", "Challenge Reminder", MessageBoxButtons.OK, MessageBoxIcon.Error);
            t.Focus();
        }

        //=====Other Functions=====
        private void displayMsg(int time, string msg)
        {
            //Show notification
            //time: The time that the notification wil be shown
            //msg: The message to show
            TrayIcon.ShowBalloonTip(time, "Challenge Reminder", msg, ToolTipIcon.Info);
        }
        private void TxtMsg_KeyDown(object sender, KeyEventArgs e)
        {
            //Ctrl+A shortcut key for message textbox
            if (e.Control && e.KeyCode == Keys.A)
            {
                //Select all
                TxtMsg.SelectAll();
                //Suppress "ding"
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }
    }
}
