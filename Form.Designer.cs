namespace ChallengeReminder
{
    partial class Form
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form));
            this.TrayMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.TrayShowBtn = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.TrayExitBtn = new System.Windows.Forms.ToolStripMenuItem();
            this.TrayIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this.LabelStartTime = new System.Windows.Forms.Label();
            this.LabelShowTime = new System.Windows.Forms.Label();
            this.TxtStartTime = new System.Windows.Forms.TextBox();
            this.TxtShowTime = new System.Windows.Forms.TextBox();
            this.LabelMsg = new System.Windows.Forms.Label();
            this.TxtMsg = new System.Windows.Forms.TextBox();
            this.BtnSave = new System.Windows.Forms.Button();
            this.BtnSaveHide = new System.Windows.Forms.Button();
            this.BtnTest = new System.Windows.Forms.Button();
            this.BtnHelp = new System.Windows.Forms.Button();
            this.MainTimer = new System.Windows.Forms.Timer(this.components);
            this.TrayMenu.SuspendLayout();
            this.SuspendLayout();
            // 
            // TrayMenu
            // 
            this.TrayMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.TrayShowBtn,
            this.toolStripSeparator1,
            this.TrayExitBtn});
            this.TrayMenu.Name = "TrayMenu";
            this.TrayMenu.Size = new System.Drawing.Size(108, 54);
            // 
            // TrayShowBtn
            // 
            this.TrayShowBtn.Name = "TrayShowBtn";
            this.TrayShowBtn.Size = new System.Drawing.Size(107, 22);
            this.TrayShowBtn.Text = "Show";
            this.TrayShowBtn.Click += new System.EventHandler(this.TrayShowBtn_Click);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(104, 6);
            // 
            // TrayExitBtn
            // 
            this.TrayExitBtn.Name = "TrayExitBtn";
            this.TrayExitBtn.Size = new System.Drawing.Size(107, 22);
            this.TrayExitBtn.Text = "Exit";
            this.TrayExitBtn.Click += new System.EventHandler(this.TrayExitBtn_Click);
            // 
            // TrayIcon
            // 
            this.TrayIcon.ContextMenuStrip = this.TrayMenu;
            this.TrayIcon.Icon = ((System.Drawing.Icon)(resources.GetObject("TrayIcon.Icon")));
            this.TrayIcon.Text = "Challenge Reminder";
            this.TrayIcon.Visible = true;
            this.TrayIcon.DoubleClick += new System.EventHandler(this.TrayShowBtn_Click);
            // 
            // LabelStartTime
            // 
            this.LabelStartTime.AutoSize = true;
            this.LabelStartTime.Location = new System.Drawing.Point(12, 15);
            this.LabelStartTime.Name = "LabelStartTime";
            this.LabelStartTime.Size = new System.Drawing.Size(137, 12);
            this.LabelStartTime.TabIndex = 1;
            this.LabelStartTime.Text = "Challenge Start Time: ";
            // 
            // LabelShowTime
            // 
            this.LabelShowTime.AutoSize = true;
            this.LabelShowTime.Location = new System.Drawing.Point(12, 47);
            this.LabelShowTime.Name = "LabelShowTime";
            this.LabelShowTime.Size = new System.Drawing.Size(119, 12);
            this.LabelShowTime.TabIndex = 2;
            this.LabelShowTime.Text = "Show Time (in ms): ";
            // 
            // TxtStartTime
            // 
            this.TxtStartTime.Location = new System.Drawing.Point(155, 12);
            this.TxtStartTime.Name = "TxtStartTime";
            this.TxtStartTime.Size = new System.Drawing.Size(217, 21);
            this.TxtStartTime.TabIndex = 3;
            this.TxtStartTime.Text = "00";
            // 
            // TxtShowTime
            // 
            this.TxtShowTime.Location = new System.Drawing.Point(155, 44);
            this.TxtShowTime.Name = "TxtShowTime";
            this.TxtShowTime.Size = new System.Drawing.Size(217, 21);
            this.TxtShowTime.TabIndex = 4;
            this.TxtShowTime.Text = "5000";
            // 
            // LabelMsg
            // 
            this.LabelMsg.AutoSize = true;
            this.LabelMsg.Location = new System.Drawing.Point(12, 78);
            this.LabelMsg.Name = "LabelMsg";
            this.LabelMsg.Size = new System.Drawing.Size(59, 12);
            this.LabelMsg.TabIndex = 5;
            this.LabelMsg.Text = "Message: ";
            // 
            // TxtMsg
            // 
            this.TxtMsg.Location = new System.Drawing.Point(12, 93);
            this.TxtMsg.Multiline = true;
            this.TxtMsg.Name = "TxtMsg";
            this.TxtMsg.Size = new System.Drawing.Size(360, 111);
            this.TxtMsg.TabIndex = 6;
            this.TxtMsg.Text = "Challenge Time! \r\nGO GO GO! ";
            this.TxtMsg.KeyDown += new System.Windows.Forms.KeyEventHandler(this.TxtMsg_KeyDown);
            // 
            // BtnSave
            // 
            this.BtnSave.Location = new System.Drawing.Point(12, 210);
            this.BtnSave.Name = "BtnSave";
            this.BtnSave.Size = new System.Drawing.Size(75, 39);
            this.BtnSave.TabIndex = 7;
            this.BtnSave.Text = "Save";
            this.BtnSave.UseVisualStyleBackColor = true;
            this.BtnSave.Click += new System.EventHandler(this.BtnSave_Click);
            // 
            // BtnSaveHide
            // 
            this.BtnSaveHide.Location = new System.Drawing.Point(93, 210);
            this.BtnSaveHide.Name = "BtnSaveHide";
            this.BtnSaveHide.Size = new System.Drawing.Size(117, 39);
            this.BtnSaveHide.TabIndex = 8;
            this.BtnSaveHide.Text = "Save And Hide";
            this.BtnSaveHide.UseVisualStyleBackColor = true;
            this.BtnSaveHide.Click += new System.EventHandler(this.BtnSaveHide_Click);
            // 
            // BtnTest
            // 
            this.BtnTest.Location = new System.Drawing.Point(216, 210);
            this.BtnTest.Name = "BtnTest";
            this.BtnTest.Size = new System.Drawing.Size(75, 39);
            this.BtnTest.TabIndex = 9;
            this.BtnTest.Text = "Test";
            this.BtnTest.UseVisualStyleBackColor = true;
            this.BtnTest.Click += new System.EventHandler(this.BtnTest_Click);
            // 
            // BtnHelp
            // 
            this.BtnHelp.Location = new System.Drawing.Point(297, 210);
            this.BtnHelp.Name = "BtnHelp";
            this.BtnHelp.Size = new System.Drawing.Size(75, 39);
            this.BtnHelp.TabIndex = 10;
            this.BtnHelp.Text = "Help";
            this.BtnHelp.UseVisualStyleBackColor = true;
            this.BtnHelp.Click += new System.EventHandler(this.BtnHelp_Click);
            // 
            // MainTimer
            // 
            this.MainTimer.Tick += new System.EventHandler(this.MainTimer_Tick);
            // 
            // Form
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(384, 261);
            this.Controls.Add(this.BtnHelp);
            this.Controls.Add(this.BtnTest);
            this.Controls.Add(this.BtnSaveHide);
            this.Controls.Add(this.BtnSave);
            this.Controls.Add(this.TxtMsg);
            this.Controls.Add(this.LabelMsg);
            this.Controls.Add(this.TxtShowTime);
            this.Controls.Add(this.TxtStartTime);
            this.Controls.Add(this.LabelShowTime);
            this.Controls.Add(this.LabelStartTime);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimumSize = new System.Drawing.Size(400, 300);
            this.Name = "Form";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Challenge Reminder Settings";
            this.WindowState = System.Windows.Forms.FormWindowState.Minimized;
            this.Load += new System.EventHandler(this.Form1_Load);
            this.Shown += new System.EventHandler(this.Form_Shown);
            this.TrayMenu.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ContextMenuStrip TrayMenu;
        private System.Windows.Forms.ToolStripMenuItem TrayShowBtn;
        private System.Windows.Forms.ToolStripMenuItem TrayExitBtn;
        private System.Windows.Forms.NotifyIcon TrayIcon;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.Label LabelStartTime;
        private System.Windows.Forms.Label LabelShowTime;
        private System.Windows.Forms.TextBox TxtStartTime;
        private System.Windows.Forms.TextBox TxtShowTime;
        private System.Windows.Forms.Label LabelMsg;
        private System.Windows.Forms.TextBox TxtMsg;
        private System.Windows.Forms.Button BtnSave;
        private System.Windows.Forms.Button BtnSaveHide;
        private System.Windows.Forms.Button BtnTest;
        private System.Windows.Forms.Button BtnHelp;
        private System.Windows.Forms.Timer MainTimer;
    }
}

