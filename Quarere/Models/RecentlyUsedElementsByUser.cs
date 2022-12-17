using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class RecentlyUsedText
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreationTime { get; set; }
        public RecentlyUsedText(string _title, string _description, DateTime _creationTime)
        {
            Title = _title;
            Description = _description;
            CreationTime = _creationTime;
        }
    }

    public class RecentlyUsedCollection
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreationTime { get; set; }
        public int TermsCount { get; set; }
        public RecentlyUsedCollection(string _title, string _description, DateTime _creationTime)
        {
            Title = _title;
            Description = _description;
            CreationTime = _creationTime;
            TermsCount = 0;
        }
    }
}