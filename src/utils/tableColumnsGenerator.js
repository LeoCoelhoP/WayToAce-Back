module.exports = function tableColumnGenerator({
  startQuestion,
  endQuestion,
  array,
}) {
  const answerKeyCircles = ['A', 'B', 'C', 'D', 'E'];
  return {
    widths: ['auto', 'auto'],
    headerRows: 1,
    body: [
      [
        { text: '', bold: true, fillColor: 'gray' },
        { text: 'A   B  C   D  E', bold: true, fillColor: 'gray' },
      ],
      ...array.slice(startQuestion, endQuestion).map((exam) => [
        {
          text: exam.index < 10 ? `0${exam.index}` : `${exam.index}`,
          fontSize: 12,
          margin: [0, 7, 0, 0],
          alignment: 'center',
        },
        {
          canvas: answerKeyCircles.map((letter, index) => ({
            type: 'ellipse',
            x: 5 + index * 17,
            y: 10,
            r1: 7,
            r2: 7,
            lineColor: 'black',
            lineWidth: 1,
            margin: [0, 0],
          })),
        },
      ]),
    ],
  };
};
