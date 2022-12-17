using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Quarere.Classes
{
    public class ResetPassoword
    {
        static public bool ResetPasswordHandler(string UserEmailOrUsername)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["users"].ConnectionString;

            SqlConnection con = new SqlConnection(connectionString);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }

            SqlCommand BeginResetPassword = new SqlCommand("spResetUserPassword", con);
            BeginResetPassword.CommandType = CommandType.StoredProcedure;

            SqlParameter UserInput = new SqlParameter("@UserNameOrEmail", UserEmailOrUsername);

            BeginResetPassword.Parameters.Add(UserInput);

            try
            {
                using (SqlDataReader rdr = BeginResetPassword.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        if (Convert.ToBoolean(rdr["ReturnCode"]))
                        {
                            SendPasswordResetEmail(rdr["Email"].ToString(), rdr["Username"].ToString(), rdr["UniqueId"].ToString());
                            con.Close();
                            return true;
                        }
                        else
                        {
                            con.Close();
                            return false;
                        }
                    }
                }
                return false;
            }

            catch
            {
                return false;
            }
        }

        static private void SendPasswordResetEmail(string ToEmail, string UserName, string UniqueId)
        {
            var MailMessage = new MimeMessage();
            MailMessage.From.Add(MailboxAddress.Parse("quarere@europe.com"));
            MailMessage.To.Add(MailboxAddress.Parse(ToEmail));
            MailMessage.Subject = "Password Reset";

            var Builder = new BodyBuilder();
            Builder.HtmlBody = "<h4>Dear " + UserName + ",</h4><br/><p>Your password reset code is: <b>" + UniqueId + "</b></p>";
            MailMessage.Body = Builder.ToMessageBody();

            using (var SMTPClient = new SmtpClient())
            {
                SMTPClient.Connect("smtp.mail.com", 587, SecureSocketOptions.StartTls);
                SMTPClient.Authenticate("quarere@europe.com", "Quarere2004$");
                SMTPClient.Send(MailMessage);
                SMTPClient.Disconnect(true);
            }
        }

        static private bool ExecuteSP(string SPName, List<SqlParameter> SPParameters)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["users"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(SPName, con);
                cmd.CommandType = CommandType.StoredProcedure;

                foreach (SqlParameter parameter in SPParameters)
                {
                    cmd.Parameters.Add(parameter);
                }

                con.Open();

                bool returnValue = Convert.ToBoolean(cmd.ExecuteScalar());

                con.Close();
                return returnValue;
            }
        }

        static public bool IsPasswordResetCodeValid(string UserCodeInput)
        {
            List<SqlParameter> paramList = new List<SqlParameter>()
            {
                new SqlParameter()
                {
                    ParameterName = "@GUID",
                    Value = UserCodeInput
                }
            };

            return ResetPassoword.ExecuteSP("spIsPasswordResetLinkValid", paramList);
        }

        static public bool ChangeUserPassword(string UserCodeInput, string NewPassword)
        {
            List<SqlParameter> paramList = new List<SqlParameter>()
            {
                new SqlParameter()
                {
                    ParameterName = "@GUID",
                    Value = UserCodeInput
                },
                new SqlParameter()
                {
                    ParameterName = "@Password",
                    Value = NewPassword
                }
            };

            return ExecuteSP("spChangePassword", paramList);
        }
    }
}