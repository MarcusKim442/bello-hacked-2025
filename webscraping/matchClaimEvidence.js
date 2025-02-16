module.exports = { getSource };

require("dotenv").config();
const OpenAI = require("openai");

const sampleClaim = "the university of alberta is a top 10 university";
const sampleWebResults = [
  {
    title: "University Rankings | University of Alberta",
    link: "https://www.ualberta.ca/en/about/university-rankings/index.html",
    snippet:
      "The University of Alberta continues to be one of Canada's top universities and is among the very best in the world.",
    text: "University Rankings | University of Alberta Home About U of A University Rankings University Rankings U of A rises 15 places to rank among world’s top 100, fourth in Canada in latest QS rankings June 04, 2024 Sustainability, employer reputation and international research drive a significant gain in the respected global rankings. The University of Alberta continues to be one of Canada’s top universities and is among the very best in the world. We inspire and uplift the students, educators and researchers who come here to seek their purpose. Working collaboratively to solve critical world problems, we also contribute to the collective progress to meet the United Nations . Sustainable Development Goals University Rankings Ranking Body World Ranking Canadian Ranking Times Higher Education Impact Rankings #6 #1 ( ) Quacquarelli Symonds QS #96 #4 ( ) Times Higher Education THE #116 #4 ( ) Academic Ranking of World Universities ARWU #106 #5 ( ) National Taiwan University NTU #101 #4 Times Hig",
  },
  {
    title: "University of Alberta in Canada - US News Best Global Universities",
    link: "https://www.usnews.com/education/best-global-universities/university-of-alberta-499977",
    snippet:
      "University of Alberta is ranked #150 in Best Global Universities. Schools are ranked according to their performance across a set of widely accepted indicators ...",
    text: "University of Alberta in Canada - US News Best Global Universities Education Colleges Rankings and Directories National Universities National Liberal Arts Colleges Regional Universities Regional Colleges HBCUs Community Colleges All Rankings Tools College Admissions Calculator Compare Colleges College Major Quiz College Search Scholarship Search Advice College Majors Finding the Right School Apply to College Guide to Financial Aid Student Loans Student Credit Cards All College Advice Webinars Admissions and Applications Financial Aid & Scholarships Building Your Resume & Extracurriculars College Majors Crafting Your College List For Parents Grad Schools Rankings Business (MBA) Education Engineering Fine Arts Health Law Library Studies Medicine Nursing Public Affairs Science Social Sciences and Humanities Tools Compare Graduate Schools Search for Graduate Schools Advice Applying to Graduate School Paying for Graduate School About the GRE Studying at a U.S. Grad School All Graduate Schoo",
  },
  {
    title: "University of Alberta : Rankings, Fees & Courses Details | Top ...",
    link: "https://www.topuniversities.com/universities/university-alberta",
    snippet:
      "North Campus, Edmonton, Canada ; # 96QS World University Rankings ; 251Undergrad. & Postgrad. Programs ; 27 % International students ; AvailableScholarship.",
    text: "University of Alberta : Rankings, Fees & Courses Details | Top Universities Click me Home Universities University of Alberta University of Alberta North Campus, Edmonton, Canada +5 campus Official Website Shortlist Compare Facebook X LinkedIn WhatsApp Email Copy Link 96 # QS World University Rankings 251 Undergrad. & Postgrad. Programs 27 % International students Available Scholarship Official Website Shortlist Compare Profile2 Menu Table of contents Overview Programs University Information Tuition Fee and Scholarships Rankings & Ratings Videos & Media Campus Locations About University of Alberta The exists to inspire and ignite the human spirit in pursuit of a better tomorrow. Its work is rooted in its commitment to equity, diversity and inclusion, while honouring Indigenous identities, languages, cultures and world views. As one of the world’s top 100 teaching and research universities, the U of A ranks among the top 5 in Canada, providing a $19.4 billion annual economic impact in Al",
  },
];

const basePrompt = `You are given a claim and up to three exerpts of text. Your job is to output:
- A section FROM ONE OF THE THREE EXERPTS that either strongly supports or strongly opposes the claim. ENSURE YOUR ANSWER LOGICALLY ADDRESSES THE CLAIM AND PROVIDES A REASON FOR OR AGAINST THE CLAIM. 
- "1", "2", or "3", based on which of the three exerpts from which you extracted the section.
- "True" if the section supports the claim, or "False" if the section opposes the claim.
Separate each of the three requirements with a new line. 

Example 1
Input:
Claim: Bananas are healthy for you
1: Jul 23, 2018 ... The bottom line is, yes, bananas are good for you. They provide an impressive hit of potassium, fibre and tryptophan, meaning they can support your gut, heart
2: While bananas have a high sugar content, it is arguable that they are still healthy for you overall due to their rich nutrient profile...
Output:
Yes, bananas are good for you. They provide an impressive hit of potassium, fibre and tryptophan, meaning they can support your gut and heart.
1
True

Example 2
Input:
Claim: The Eiffel tower finished in 1749
1: Aug 15, 2016 ... Formula 1 drivers react in a fraction of a second ... speed dance of darting blades—all those athletes have ridiculous reaction times.
2: Apr 10, 2022 ... The Eiffel tower is a tourist location in Paris, gaining tens of thousands of visitors on a yearly basis. 
3: The construction work of the Eiffel Tower began in January 1887 and was finished on March 31, 1889.
Output:
The construction work of the Eiffel Tower began in January 1887 and was finished on March 31, 1889.
3
False

Here is your input:
`;

async function getSource(claim, webResults) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  var prompt = basePrompt;
  prompt += `Claim: ${claim}\n`;
  for (var i = 0; i < webResults.length; i++) {
    prompt += `${i + 1}: ${webResults[i].snippet} ... ${webResults[i].text}\n`;
  }

  // console.log(prompt);

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a robot assistant that should behave in a very deterministic manner.",
      },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
}

// async function main() {
//   try {
//     const data = await getSource(sampleClaim, sampleWebResults);
//     console.log(data);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// main();
