using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Quarere.Models
{
    public class UserTextData
    {
        [MaxLength(30)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }

        public List<string> Words { get; set; }

        public string Text { get; set; }

        public UserTextData(string _title, string _description,
            List<string> _words, string _text)
        {
            Title = _title;
            Description = _description;
            Words = _words;
            Text = _text;
        }
    }
}