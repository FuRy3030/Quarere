using Quarere.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Quarere.Entities
{
    public class UserTextContext : DbContext
    {
        public UserTextContext(string nameOrConnectionString) : base (nameOrConnectionString)
        {

        }
    }
}