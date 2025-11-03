import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Generate a sample data with JSON object with: 
        {date("yyyy-mm-dd"), 
        title, 
        inventors (array){Name, id, nationality, inventorship(give me number of percents), employer, address, Phone, email}, 
        abstract(TO BE COMPLETED AFTER FILLING IN THE FORM. Include the need and the proposed solution to said  need as 5~10 lines), 
        invention {
          description (Describe the invention in detail including all essential elements. If you have a draft of a scientific article, a presentation, a grant proposal etc. related to the invention please also send by e-mail, in a separate file),
          keywords (array) (Please provide 5 keywords that describe the main features of the invention),
          background (Provide details on the field of invention, what is common knowledge in the field and what are the pitfall and unanswered needs),
          problem (Describe in detail the need identified by you for which the invention is a solution) (up to 1 paragraph),
          components (Give me them as one string and splite by '\\n') (Describe in detail the elements of the invention that are crucial for its function. The elements could be parts of a device, a molecular formulation, physical characteristics, computational elements, working conditions, structural features such as size, shape, material etc. Make sure to include all the elements.) (up to 1 page),
          advantages (Based on your knowledge and expertise, describe in detail what is new (not previously known) in the solution proposed, why it is important, and what are the benefits compared to existing solutions) (up to 5 paragraphs)
          results (array) (Where applicable, provide results such as in vitro, in vivo, prototype, simulation, working computer program, statistics, etc.)  (1~3 pages)
        }, 
        prior_art (array) {title, authors, published(journal/conference/thesis/web), PublicationDate}( Are there publications by you (the inventors) or by others working in the field, with a solution to a similar problem? , Have you conducted a patent search related to the Invention? The following links may be used for conducting a patent search:       http://www.uspto.gov/     https://patents.google.com/ https://worldwide.espacenet.com/ , For other publications, you may search in any search engine (e.g. Google), or in PubMed, for scientific publications. Please note that the inventor has a strict duty to disclose all technology, including scientific and patent publications, or apparatus and processes sold or used in public, that might be relevant to the patentability of the invention. , In addition, please provide publications that help understand the current knowledge in the field of the invention.),
        disclosure (array) {title, authors, published(journal/conference/thesis/web), Date}, (Was the invention, related ideas, or results disclosed in any way prior to the submission of this form? ),
        plans (array) {title, authors, disclosed(article/oral presentation/a thesis, other), Date(Planned publication Date)} ( Do you intend to publish the invention, its related ideas or results in any way in the near future (within the next 6 months)?)
      }
        about "${title}".
        Today is "${new Date().toISOString()}"
        I need only JSON data {...,...,......}
        I don't need 'here is the ...'
        generate each data follow my guide that I give you in (), no response as these`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log(prompt);
    console.log(response.data.choices[0].message.content);
    const result = JSON.parse(response.data.choices[0].message.content);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating IDF data:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to generate IDF data' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
} 