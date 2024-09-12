const PdfPrinter = require('pdfmake');
const Exam = require('../models/Exam');
const tableColumnGenerator = require('../utils/tableColumnsGenerator');

async function checkAnserKey(req, res) {
  try {
    installDOM();
    await loadOpenCV();

    const image = await loadImage('./public/answerKey.jpg');

    const src = cv.imread(image);

    return res.status(200).json({ message: 'no error' });
  } catch (error) {
    throw Error(error);
  }
}

async function generateAnswerKey(req, res) {
  try {
    const { examId } = req.body;
    // Generate QR Code Buffer
    const examDoc = await Exam.findById(examId);

    if (!examDoc) throw Error('Please provide a valid Exam Id');
    const qrCodeText = `${process.env.APP_UR}/${examDoc._id}`;

    // Create New PDF
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      pageMargins: [8, 25, 0, 0],
      content: [
        {
          text: 'Way to Ace',
          style: 'header',
          fontSize: 30,
          alignment: 'center',
          margin: [0, 0, 0, 10],
          bold: true,
        },
        {
          text: examDoc.examName,
          style: 'subheader',
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },

        {
          columns: [
            {
              stack: [
                {
                  text: 'Instruções:',
                  style: 'subheader',
                  fontSize: 16,
                  margin: [0, 0, 0, 10],
                },
                {
                  ul: [
                    'Preencha o gabarito preferencialmente utilizando caneta preta.',
                    'Preencha completamente a alternativa correta.',
                    'Enquadre em sua foto somente o que está dentro dos quadrados pretos, como demonstrado na imagem exemplo.',
                    'Em caso de rasura ou dupla resposta, a questão será considerada incorreta',
                    'Escaneie o QR Code para acessar o corretor de gabaritos.',
                    'Certifique-se de que o gabarito e o QRCode na foto para correção automática esteja nitido.',
                  ],
                  fontSize: 14,
                  margin: [0, 0, 0, 10],
                },
              ],
            },
            {
              qr: qrCodeText,
              width: '30%',
              alignment: 'center',
              margin: [0, 25],
            },
          ],
        },
        {
          columns: [
            {
              table: tableColumnGenerator({
                startQuestion: 0,
                endQuestion: 20,
                array: examDoc.questions,
              }),
            },
            {
              table: tableColumnGenerator({
                startQuestion: 20,
                endQuestion: 40,
                array: examDoc.questions,
              }),
            },
            {
              table: tableColumnGenerator({
                startQuestion: 40,
                endQuestion: 60,
                array: examDoc.questions,
              }),
            },
            {
              table: tableColumnGenerator({
                startQuestion: 60,
                endQuestion: 80,
                array: examDoc.questions,
              }),
            },
            {
              table: tableColumnGenerator({
                startQuestion: 80,
                endQuestion: 100,
                array: examDoc.questions,
              }),
            },
          ],
        },
      ],

      defaultStyle: {
        font: 'Helvetica',
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    throw Error(error);
  }
}

module.exports = { checkAnserKey, generateAnswerKey };
