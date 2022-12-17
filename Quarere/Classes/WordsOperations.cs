using HtmlAgilityPack;
using Quarere.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Numerics;
using System.Text.RegularExpressions;
using System.Web;

namespace Quarere.Classes
{
    public class WordsOperations
    {
        public static string ClearString(string text)
        {
            string ClearedText = text.Trim().Replace("'ll", " will").Replace("'re", " are").Replace("'ve", " have")
                .Replace(".", "").Replace(",", "").Replace(";", "").Replace(":", "").Replace("-", "")
                .Replace("?", "").Replace("!", "").Replace("...", "").Replace("(", "").Replace(")", "")
                .Replace("[", "").Replace("]", "").Replace("\"", "").Replace("—", "").Replace("  ", " ")
                .Replace("”", "").Replace("’ll", " will").Replace("’re", " are").Replace("’ve", " have");
            RegexOptions options = RegexOptions.None;
            Regex regex = new Regex("[ ]{2,}", options);
            ClearedText = regex.Replace(ClearedText, " ");
            return ClearedText;
        }

        public static string FindWordLevel(string word)
        {
            string connection = ConfigurationManager.ConnectionStrings["wordsCon"].ConnectionString;
            SqlConnection con = new SqlConnection(connection);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            if (word.Contains("n't"))
            {
                word = word.Replace("'", "’");
            }
            else { word = word.Replace("'", ""); }
            SqlCommand findLevel = new SqlCommand("SELECT level FROM Words WHERE word = '"+ word +"';", con);
            string MatchingWord = (string)findLevel.ExecuteScalar();
            if (MatchingWord != null)
            {
                con.Close();
                return MatchingWord;
            }
            else 
            { 
                con.Close(); 
                return "Not Defined"; 
            }
        }

        public static string FindPolishTranslation(string Word, string PartOfSpeech)
        {
            string PolishPartOfSpeech = "";
            switch(PartOfSpeech)
            {
                case "verb":
                    PolishPartOfSpeech = "{czas.}";
                    break;
                case "adjective":
                    PolishPartOfSpeech = "{przym.}";
                    break;
                case "noun":
                    PolishPartOfSpeech = "{rzecz.}";
                    break;
                case "pronoun":
                    PolishPartOfSpeech = "{zaim.}";
                    break;
                case "adverb":
                    PolishPartOfSpeech = "{przysł.}";
                    break;
                case "preposition":
                    PolishPartOfSpeech = "{przym.}";
                    break;
                case "conjunction":
                    PolishPartOfSpeech = "{spójn.}";
                    break;
                case "number":
                    PolishPartOfSpeech = "{licz.}";
                    break;
                default:
                    return "";
            }
            HtmlWeb DictionaryWebsite = new HtmlWeb();
            HtmlDocument HTMLDocument = DictionaryWebsite.Load($"https://pl.bab.la/slownik/angielski-polski/{Word}");
            Debug.WriteLine(PolishPartOfSpeech);
            try
            {
                var TranslationInitial = HTMLDocument.DocumentNode.SelectNodes($"/descendant::span[@class='suffix'][text()='{PolishPartOfSpeech}'][1]" +
                        "/parent::div/following-sibling::div[1]/ul/li/a[2]");
                var TranslationsFollowing = HTMLDocument.DocumentNode.SelectNodes($"/descendant::span[@class='suffix'][text()='{PolishPartOfSpeech}'][1]" +
                        "/parent::div/following-sibling::div[1]/ul/li/a[1]");

                if (TranslationInitial == null)
                {
                    return "";
                }
                if (TranslationInitial != null && TranslationsFollowing[1] == null)
                {
                    return TranslationInitial[0].InnerText;
                }

                int TranslationsNumber = TranslationsFollowing.Count < 5 ? TranslationsFollowing.Count : 5;
                string TranslationsString = TranslationInitial[0].InnerText;
                for (int i = 1; i < TranslationsNumber; i++)
                {
                    TranslationsString = TranslationsString + ", " + TranslationsFollowing[i].InnerText;
                }

                return TranslationsString + ".";
            }
            catch
            {
                return "";
            }
        }

        //public static Queue<string> GetLongWordsQueue(string text)
        //{

        //}

        public static List<WordWithLevel> GetLongWords(string text)
        {
            string connection = ConfigurationManager.ConnectionStrings["wordsCon"].ConnectionString;
            SqlConnection con = new SqlConnection(connection);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            SqlCommand command = con.CreateCommand(); //stworzyć  komendę któa pobiera wszystkie elementy tablicy cz1;
            command.CommandText = "SELECT * FROM LongWords"; //stworzyć  komendę któa pobiera wszystkie elementy tablicy cz1;
            SqlDataReader reader = command.ExecuteReader(); //wyonać komendę i pobirać dane
            //przglądanie tablicy
            string a = ClearString(text); //Cała zawartość naszego text boxa;
            a = ' ' + a + ' ';
            List<WordWithLevel> LongWords = new List<WordWithLevel>();
            Debug.WriteLine(a);
            int a_length = a.Length; // długość
            //Debug.WriteLine('1');
            while (reader.Read())
            {
                string b;
                b = reader.GetString(1);//pobiranie longword to sprawdzenia kmp
                b = ' ' + b + ' ';
                //Debug.Write(b);
                //Debug.WriteLine('2');

                int bs = b.Length; // długość
                int [] check = new int[2*bs];
                //Vector<int> chceck = new Vector<int>(bs);
                check[0] = -1;
                int p = 1, k = 0;
                //Debug.WriteLine('3');
                while (p < bs)
                {
                    if (b[p] == b[k])
                    {
                        check[p] = check[k];
                    }
                    else
                    {
                        check[p] = k;
                        while (k >= 0 && b[p] != b[k])
                        {
                            k = check[k];
                        }
                    }
                    p++;
                    k++;
                    check[p] = k;
                }
                //Debug.WriteLine('4');
                int i = 0;
                int j = 0;
                while (j < a_length)
                {
                    if (b[i] == a[j])
                    {
                        i++;
                        j++;
                        if (i == bs)
                        {
                            //Debug.WriteLine(b);
                            LongWords.Add(new WordWithLevel(b.Substring(1, b.Length - 2), reader.GetString(2))); //Reader.GetLine();
                            Debug.WriteLine(b.Substring(1, b.Length - 2));
                            break;
                        }
                    }
                    else
                    {
                        i = check[i];
                        if (i < 0)
                        {
                            j++;
                            i++;
                        }
                    }
                }
                //Debug.WriteLine('5');
            }
            //Debug.WriteLine('6');
            con.Close(); //zamknięcie połącznia
            return LongWords;
        }
    }
}