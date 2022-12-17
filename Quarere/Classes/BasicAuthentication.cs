using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using static Quarere.Classes.LoginAuthentication;

namespace Quarere.Classes
{
    public class BasicAuthenticationAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.Request.Headers.Authorization == null)
            {
                actionContext.Response = actionContext.Request
                    .CreateResponse(HttpStatusCode.Unauthorized);
            }
            else
            {
                string authenticationToken = actionContext.Request.Headers.Authorization.Parameter;
                string decodedToken = Encoding.UTF8.GetString
                    (Convert.FromBase64String(authenticationToken));
                string[] authenticationCredentials = decodedToken.Split(':');
                string username = authenticationCredentials[0];
                string SessionID = authenticationCredentials[1];
                string[] roles = { "normal_user" };

                if(Authenticate(username, SessionID) == true)
                {
                    Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(username), roles);
                }
                else
                {
                    actionContext.Response = actionContext.Request
                    .CreateResponse(HttpStatusCode.Unauthorized);
                }
            }
        }
    }
}