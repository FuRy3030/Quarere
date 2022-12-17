using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.SessionState;
using static Quarere.Classes.ConnectionStringGenerator;
using Quarere.Classes;

namespace Quarere
{
    public partial class Site1 : System.Web.UI.MasterPage
    {
        string connection = ConfigurationManager.ConnectionStrings["users"].ConnectionString;
        string connectionMaster = ConfigurationManager.ConnectionStrings["MasterDatabase"].ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if((string)Session["role"] == "guest" || (string)Session["role"] == null)
            {
                LoginButtonNavbar.Style["display"] = "block";
                SignUpButtonNavbar.Style["display"] = "block";
                LogoutButtonNavbar.Style["display"] = "none";
                LoginButtonNavbar.Visible = true;
                SignUpButtonNavbar.Visible = true;
                LogoutButtonNavbar.Visible = false;
            }
            else if((string)(Session["role"]) == "user")
            {
                LoginButtonNavbar.Style["display"] = "none";
                SignUpButtonNavbar.Style["display"] = "none";
                LogoutButtonNavbar.Style["display"] = "block";
                SignUpButtonNavbar.Visible = false;
                LoginButtonNavbar.Visible = false;
                LogoutButtonNavbar.Visible = true;
            }
            SessionID.Value = HttpContext.Current.Session.SessionID.ToString();
            Username.Value = String.IsNullOrEmpty((string)Session["username"]) ? "notLogged" : (string)Session["username"];
        }

        protected class NewUserValidation
        {
            public bool exists;
            public bool usernameExists;
            public bool emailExists;
            public NewUserValidation(bool _exists, 
                bool _usernameExists, bool _emailExists)
            {
                exists = _exists;
                usernameExists = _usernameExists;
                emailExists = _emailExists;
            }
        }

        protected void DisplayInvalidInputRegister(string alertMessage)
        {
            modalLogin.Style["display"] = "block";
            register.Style["display"] = "block";
            login.Style["display"] = "none";
            alertRegister.Style["display"] = "block";
            alertRegister.InnerHtml = alertMessage;
        }

        protected void DisplayInvalidInputLogin(string alertMessage)
        {
            modalLogin.Style["display"] = "block";
            alertLogin.Style["display"] = "block";
            alertLogin.InnerHtml = alertMessage;
        }

        protected void ShowRegisterSuccess()
        {
            alertRegister.Style["display"] = "none";
            RegisterSuccess.Style["display"] = "block";
            RegisterBackdrop.Style["display"] = "block";
            modalLogin.Style["display"] = "none";
        }

        protected void ShowLoginSuccess()
        {
            alertLogin.Style["display"] = "none";
            LoginBackdrop.Style["display"] = "block";
            LoginSuccess.Style["display"] = "block";
            modalLogin.Style["display"] = "none";
            WelcomeTextModal.InnerHtml = "Welcome Back " + Session["username"] + "!";
            RegisterSuccess.Style["display"] = "none";
            RegisterBackdrop.Style["display"] = "none";
        }

        protected bool ValidateUsername(string username)
        {
            SqlConnection con = new SqlConnection(connection);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            SqlCommand checkUsername = new SqlCommand("SELECT * FROM Users WHERE" +
                " username = '" + username + "';", con);
            SqlDataAdapter checkUsernameAdapter = new SqlDataAdapter(checkUsername);
            DataTable checkUsernameTable = new DataTable();
            checkUsernameAdapter.Fill(checkUsernameTable);
            con.Close();

            if (checkUsernameTable.Rows.Count >= 1)
            {
                return true;
            }
            return false;
        }

        protected bool ValidateEmail()
        {
            SqlConnection con = new SqlConnection(connection);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            SqlCommand checkEmail = new SqlCommand("SELECT * FROM Users WHERE" +
                " email = '" + RegisterEmail.Value.Trim() + "';", con);
            SqlDataAdapter checkEmailAdapter = new SqlDataAdapter(checkEmail);
            DataTable checkEmailTable = new DataTable();
            checkEmailAdapter.Fill(checkEmailTable);
            con.Close();

            if (checkEmailTable.Rows.Count >= 1)
            {
                Debug.WriteLine("ValidateEmail");
                Debug.WriteLine("true");
                return true;
            }
            Debug.WriteLine("ValidateEmail");
            Debug.WriteLine("false");
            return false;
        }

        protected bool ValidatePasswordLogin()
        {
            SqlConnection con = new SqlConnection(connection);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            SqlCommand checkPassword = new SqlCommand("SELECT * FROM Users WHERE" +
                " password = '" + LoginPassword.Value.Trim() + "';", con);
            SqlDataAdapter checkPasswordAdapter = new SqlDataAdapter(checkPassword);
            DataTable checkPasswordTable = new DataTable();
            checkPasswordAdapter.Fill(checkPasswordTable);
            con.Close();

            if (checkPasswordTable.Rows.Count >= 1)
            {
                return true;
            }
            return false;
        }

        protected NewUserValidation UserExistsRegister()
        {
            NewUserValidation UserExists = new NewUserValidation(false, false, false);
            bool DoesUsernameExists = ValidateUsername(RegisterUsername.Value.Trim());
            if (DoesUsernameExists)
            {
                UserExists.exists = true;
                UserExists.usernameExists = true;
            }
            bool DoesEmailExists = ValidateEmail();
            if (DoesEmailExists)
            {
                UserExists.exists = true;
                UserExists.emailExists = true;
            }
            Debug.WriteLine("UserExists");
            Debug.WriteLine(UserExists.emailExists);
            return UserExists;
        }

        protected bool UserExistsLogin()
        {
            if(ValidateUsername(LoginUsername.Value.Trim()))
            {
                return true;
            }
            return false;
        }

        protected bool areCredentialsValid()
        {
            if (ValidateUsername(LoginUsername.Value.Trim()) == true && ValidatePasswordLogin() == true)
            {
                return true;
            }
            return false;
        }

        protected void SignUpButton_ServerClick(object sender, EventArgs e)
        {
            if (RegisterUsername.Value.Trim() == "" ||
               RegisterEmail.Value.Trim() == "" ||
               RegisterPassword.Value.Trim() == "")
            {
                DisplayInvalidInputRegister("None of the fields can be empty!");
            }
            else if (RegisterUsername.Value.Length > 30 ||
                RegisterEmail.Value.Length > 40 ||
                RegisterPassword.Value.Length > 30)
            {
                DisplayInvalidInputRegister("Username, email or password are too long!");
            }
            else if (!RegisterEmail.Value.Contains('@'))
            {
                DisplayInvalidInputRegister("Email must contain '@'!");
            }
            else if (RegisterEmail.Value.Trim().Contains(' ') ||
                RegisterUsername.Value.Trim().Contains(' ') ||
                RegisterPassword.Value.Trim().Contains(' '))
            {
                DisplayInvalidInputRegister("None of the fields can contain empty space!");
            }
            else if (UserExistsRegister().exists == true)
            {
                NewUserValidation newUserCheck = UserExistsRegister();
                Debug.WriteLine(newUserCheck.emailExists);
                Debug.WriteLine(newUserCheck.usernameExists);
                if (newUserCheck.usernameExists == true && 
                    newUserCheck.emailExists == false)
                {
                    DisplayInvalidInputRegister("Username already exists!");
                }
                if (newUserCheck.usernameExists == false &&
                    newUserCheck.emailExists == true)
                {
                    DisplayInvalidInputRegister("Email already exists!");
                }
                else if (newUserCheck.usernameExists == true &&
                    newUserCheck.emailExists == true)
                {
                    DisplayInvalidInputRegister("Email and username already exists!"); 
                }
            }
            else 
            {
                bool isError = false;
                try
                {
                    SqlConnection con = new SqlConnection(connection);
                    if (con.State == ConnectionState.Closed)
                    {
                        con.Open();
                    }
                    SqlCommand createUser = new SqlCommand("INSERT INTO Users " +
                    "(username, email, password) values (@username, @email, @password)", con);

                    createUser.Parameters.AddWithValue("@username", RegisterUsername.Value.Trim());
                    createUser.Parameters.AddWithValue("@email", RegisterEmail.Value.Trim());
                    createUser.Parameters.AddWithValue("@password", RegisterPassword.Value.Trim());

                    createUser.ExecuteNonQuery();
                    con.Close();


                    SqlConnection conMaster = new SqlConnection(connectionMaster);
                    if (conMaster.State == ConnectionState.Closed)
                    {
                        conMaster.Open();
                    }
                    SqlCommand createUsersDatabase = new SqlCommand("CREATE DATABASE " +
                        RegisterUsername.Value.Trim(), conMaster);

                    createUsersDatabase.ExecuteNonQuery();
                    conMaster.Close();

                    string connectionString = GetUserConnectionString(RegisterUsername.Value.Trim());
                    SqlConnection conMasterNewDB = new SqlConnection(connectionString);
                    if (conMasterNewDB.State == ConnectionState.Closed)
                    {
                        conMasterNewDB.Open();
                    }
                    string CreateTextTableCmd = "CREATE TABLE UserTexts (" +
                        "text_id INT NOT NULL IDENTITY(1, 1) PRIMARY KEY," +
                        "title NVARCHAR(100) NOT NULL," +
                        "description NVARCHAR(200)," +
                        "text NVARCHAR(MAX) NOT NULL," +
                        "creation_time SMALLDATETIME NOT NULL);";
                    SqlCommand CreateTextTable = new SqlCommand(CreateTextTableCmd, conMasterNewDB);
                    CreateTextTable.ExecuteNonQuery();

                    string CreateFlashcardsTableCmd = "CREATE TABLE UserCollections (" +
                        "collection_id INT NOT NULL IDENTITY(1, 1) PRIMARY KEY," +
                        "title NVARCHAR(100) NOT NULL," +
                        "description NVARCHAR(200)," +
                        "creation_time SMALLDATETIME NOT NULL);";
                    SqlCommand CreateFlashcardsTable = new SqlCommand(CreateFlashcardsTableCmd, conMasterNewDB);
                    CreateFlashcardsTable.ExecuteNonQuery();

                    string CreateFavoritesTableCmd = "CREATE TABLE UserFavorites (" +
                        "title NVARCHAR(100) NOT NULL," +
                        "terms_count SMALLINT," +
                        "creation_time SMALLDATETIME NOT NULL);";
                    SqlCommand CreateFavoritesTable = new SqlCommand(CreateFavoritesTableCmd, conMasterNewDB);
                    CreateFavoritesTable.ExecuteNonQuery();

                    conMasterNewDB.Close();
                }
                catch (Exception ex)
                {
                    DisplayInvalidInputRegister("Forbidden characters in username or email");
                    isError = true;
                }

                if(isError == false)
                {
                    ShowRegisterSuccess();
                }
            }
        }

        protected void LogInButton_ServerClick(object sender, EventArgs e)
        {
            if(UserExistsLogin() == false)
            {
                DisplayInvalidInputLogin("Account with this username doesn't exist!");
            }
            else if(areCredentialsValid() == false)
            {
                DisplayInvalidInputLogin("Incorrect username or password!");
            }
            else if(areCredentialsValid() == true)
            {
                Session["username"] = LoginUsername.Value.Trim();
                Session["password"] = LoginPassword.Value.Trim();
                Session["role"] = "user";
                LoginButtonNavbar.Style["display"] = "none";
                LogoutButtonNavbar.Style["display"] = "block";
                SignUpButtonNavbar.Style["display"] = "none";
                SignUpButtonNavbar.Visible = false;
                LoginButtonNavbar.Visible = false;
                LogoutButtonNavbar.Visible = true;
                string current_id = Session.SessionID.ToString();

                SqlConnection con = new SqlConnection(connection);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                SqlCommand updateSesionStatus = new SqlCommand("UPDATE Users " +
                "SET current_session_id = @id, is_authenticated = @auth_status " +
                "WHERE username = '" + LoginUsername.Value.Trim() + "'", con);

                updateSesionStatus.Parameters.AddWithValue("@id", current_id);
                updateSesionStatus.Parameters.AddWithValue("@auth_status", 1);                

                updateSesionStatus.ExecuteNonQuery();
                con.Close();

                SessionID.Value = HttpContext.Current.Session.SessionID.ToString();
                Username.Value = (string)Session["username"];
                LoginUsername.Value = "";
                LoginPassword.Value = "";
                Debug.WriteLine("LOGIN");

                ShowLoginSuccess();
            }
        }

        protected void loginButtonNavbar_ServerClick(object sender, EventArgs e)
        {
            modalLogin.Style["display"] = "block";
            register.Style["display"] = "none";
            login.Style["display"] = "block";
            PasswordReset.Style["display"] = "none";
            NewPasswordSet.Style["display"] = "none";
        }

        protected void SignUpButtonNavbar_ServerClick(object sender, EventArgs e)
        {
            modalLogin.Style["display"] = "block";
            register.Style["display"] = "block";
            login.Style["display"] = "none";
            PasswordReset.Style["display"] = "none";
            NewPasswordSet.Style["display"] = "none";
        }

        protected void logoutButtonNavbar_ServerClick(object sender, EventArgs e)
        {
            Session.Abandon();
            Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId"));
            Session["role"] = "guest";
            SessionID.Value = HttpContext.Current.Session.SessionID.ToString();
            Username.Value = (string)Session["username"];
            Response.Redirect(Request.RawUrl);
        }

        protected void ResetPasswordButton_ServerClick(object sender, EventArgs e)
        {
            bool IsRequestSent = ResetPassoword.ResetPasswordHandler(PasswordResetEmail.Value.ToString().Trim());
            if (IsRequestSent)
            {
                modalLogin.Style["display"] = "block";
                login.Style["display"] = "none";
                register.Style["display"] = "none";
                PasswordReset.Style["display"] = "none";
                alertPasswordReset.Style["display"] = "none";
                NewPasswordSet.Style["display"] = "block";
                PasswordResetEmail.Value = "";
            }
            else
            {
                modalLogin.Style["display"] = "block";
                login.Style["display"] = "none";
                register.Style["display"] = "none";
                PasswordReset.Style["display"] = "block";
                alertPasswordReset.Style["display"] = "block";
                PasswordResetEmail.Value = "";
                alertPasswordReset.InnerText = "Account with this email doesn't exist!";
            }
        }

        protected void SetNewPasswordButton_ServerClick(object sender, EventArgs e)
        {
            modalLogin.Style["display"] = "block";
            login.Style["display"] = "none";
            register.Style["display"] = "none";
            PasswordReset.Style["display"] = "none";
            NewPasswordSet.Style["display"] = "block";

            if (NewPassword.Value.Trim() != RepeatNewPassword.Value.Trim())
            {
                alertPasswordSet.Style["display"] = "block";
                successPasswordSet.Style["display"] = "none";
                alertPasswordSet.InnerHtml = "Passwords don't match!";
            }
            else if (NewPassword.Value.Trim() == "")
            {
                alertPasswordSet.Style["display"] = "block";
                successPasswordSet.Style["display"] = "none";
                alertPasswordSet.InnerHtml = "Password can't be empty!";
            }
            else if (NewPassword.Value.Trim().Contains(' ') || NewPassword.Value.Trim().Length > 30)
            {
                alertPasswordSet.Style["display"] = "block";
                successPasswordSet.Style["display"] = "none";
                alertPasswordSet.InnerHtml = "Password is either too long or contains a space!";
            }
            else
            {
                string GUIDCode = PasswordResetCode.Value.Trim();
                if (ResetPassoword.IsPasswordResetCodeValid(GUIDCode))
                {
                    ResetPassoword.ChangeUserPassword(GUIDCode, NewPassword.Value.Trim());
                    alertPasswordSet.Style["display"] = "none";
                    successPasswordSet.Style["display"] = "block";
                    successPasswordReset.InnerHtml = "Password was changed successfully!";
                    PasswordResetCode.Value = "";
                }
                else
                {
                    alertPasswordSet.Style["display"] = "block";
                    successPasswordSet.Style["display"] = "none";
                    alertPasswordSet.InnerHtml = "Reset code is incorrect!";
                }
            }
        }
    }
}