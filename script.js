// ========================================
// 武将タイプ診断
// script.js 完成版
// ========================================


// ========================================
// 質問データ
// ========================================

const questions = [

  {
    text: "新しい方法やアイデアを思いついたら、失敗する可能性があっても試してみたい。",
    type: "innovation"
  },

  {
    text: "周囲の人が反対していても、自分が正しいと思った道なら突き進みたい。",
    type: "innovation"
  },

  {
    text: "大きなチャンスが目の前にあれば、多少のリスクを取ってでも挑戦したい。",
    type: "innovation"
  },

  {
    text: "初対面の人ともすぐに打ち解け、仲良くなることができる。",
    type: "social"
  },

  {
    text: "人の長所を見つけて、その人の力を引き出すのが得意だ。",
    type: "social"
  },

  {
    text: "自分とは考え方が違う人でも、目的のためなら協力できる。",
    type: "social"
  },

  {
    text: "何かを成し遂げるときは、目先の結果よりも長期的な計画を考える。",
    type: "careful"
  },

  {
    text: "感情だけで決めず、状況を冷静に分析してから行動することが多い。",
    type: "careful"
  },

  {
    text: "今すぐ結果が出なくても、将来のためにじっくり待つことができる。",
    type: "careful"
  },

  {
    text: "一度「こうする」と決めたことは、簡単には曲げない。",
    type: "belief"
  },

  {
    text: "自分が大切だと思う信念やルールは、損をしてでも守りたい。",
    type: "belief"
  },

  {
    text: "周囲からどう思われるかより、自分自身が納得できるかどうかを重視する。",
    type: "belief"
  },

  {
    text: "人と同じことをするより、自分なりのやり方を見つけたい。",
    type: "individual"
  },

  {
    text: "「いつか大きなことを成し遂げたい」という野心がある。",
    type: "individual"
  },

  {
    text: "自分の力を試せる場があれば、積極的に挑戦したい。",
    type: "individual"
  }

];


// ========================================
// 武将ごとの得点
// ========================================

let scores = {

  信長: 0,
  秀吉: 0,
  家康: 0,
  信玄: 0,
  謙信: 0,
  政宗: 0

};


// ========================================
// 性格5項目の得点
// ========================================

let axisScores = {

  innovation: 0,
  social: 0,
  careful: 0,
  belief: 0,
  individual: 0

};


// ========================================
// 今何問目か
// ========================================

let currentQuestion = 0;


// ========================================
// HTMLの要素を取得
// ========================================

const startScreen =
  document.getElementById("startScreen");

const quiz =
  document.getElementById("quiz");

const result =
  document.getElementById("result");

const resultEffect =
  document.getElementById("resultEffect");

const restartEffect =
  document.getElementById("restartEffect");

const startButton =
  document.getElementById("startButton");

const restartButton =
  document.getElementById("restartButton");

const questionNumber =
  document.getElementById("questionNumber");

const progressNumber =
  document.getElementById("progressNumber");

const progressFill =
  document.getElementById("progressFill");

const questionText =
  document.getElementById("questionText");

const answers =
  document.getElementById("answers");

const resultImage =
  document.getElementById("resultImage");

const resultType =
  document.getElementById("resultType");

const resultDescription =
  document.getElementById("resultDescription");


// ========================================
// 回答ボタン
// ========================================

const choices = [

  "とてもそう思う",

  "まあまあそう思う",

  "どちらともいえない",

  "あまりそう思わない",

  "まったくそう思わない"

];


// ========================================
// 診断スタート
// ========================================

startButton.addEventListener(
  "click",
  function () {

    resetScores();

    currentQuestion = 0;

    startScreen.style.display = "none";

    quiz.style.display = "block";

    quiz.classList.remove("questionExit");
    quiz.classList.remove("questionEnter");

    showQuestion();

  }
);


// ========================================
// 得点リセット
// ========================================

function resetScores() {

  scores = {

    信長: 0,
    秀吉: 0,
    家康: 0,
    信玄: 0,
    謙信: 0,
    政宗: 0

  };


  axisScores = {

    innovation: 0,
    social: 0,
    careful: 0,
    belief: 0,
    individual: 0

  };

}


// ========================================
// 質問を表示
// ========================================

function showQuestion() {

  const question =
    questions[currentQuestion];


  // 質問番号

  questionNumber.textContent =
    "第" + (currentQuestion + 1) + "問";


  // 進行番号

  progressNumber.textContent =
    currentQuestion + 1;


  // プログレスバー

  const progress =
    ((currentQuestion + 1) /
      questions.length) * 100;

  progressFill.style.width =
    progress + "%";


  // 質問文章

  questionText.textContent =
    question.text;


  // 回答ボタンを空にする

  answers.innerHTML = "";


  // 回答ボタンを作る

  choices.forEach(
    function (choice, index) {

      const button =
        document.createElement("button");

      button.textContent =
        choice;

      button.className =
        "answerButton";


      // 回答クリック

      button.addEventListener(
        "click",
        function () {

          // 二重クリック防止

          const allButtons =
            document.querySelectorAll(
              ".answerButton"
            );

          allButtons.forEach(
            function (btn) {

              btn.disabled = true;

            }
          );


          // 点数

          const point =
            5 - index;


          // 武将の点数

          addWarriorScore(
            currentQuestion,
            point
          );


          // 性格5項目の点数

          axisScores[
            question.type
          ] += point;


          // 次の質問

          currentQuestion++;


          // まだ質問がある場合

          if (
            currentQuestion <
            questions.length
          ) {

            switchQuestion();

          }

          // 15問終了

          else {

            showResult();

          }

        }
      );


      answers.appendChild(
        button
      );

    }
  );

}


// ========================================
// 質問切り替え
// ★ここが今回の重要ポイント
// ========================================

function switchQuestion() {

  // ----------------------------
  // 今の質問を左へ移動
  // ----------------------------

  quiz.classList.remove(
    "questionEnter"
  );

  quiz.classList.remove(
    "questionExit"
  );

  // アニメーションを
  // 最初から再生させる

  void quiz.offsetWidth;

  // 左へスライド

  quiz.classList.add(
    "questionExit"
  );


  // ----------------------------
  // 0.35秒後に次の質問へ
  // ----------------------------

  setTimeout(
    function () {

      quiz.classList.remove(
        "questionExit"
      );


      // 次の質問を表示

      showQuestion();


      // ----------------------------
      // 右側から登場
      // ----------------------------

      void quiz.offsetWidth;

      quiz.classList.add(
        "questionEnter"
      );


      // アニメーション終了後
      // クラスを削除

      setTimeout(
        function () {

          quiz.classList.remove(
            "questionEnter"
          );

        },
        500
      );

    },
    350
  );

}


// ========================================
// 武将ごとの得点
// ========================================

function addWarriorScore(
  questionIndex,
  point
) {

  const questionScores = [

    // Q1
    {
      信長: 1.0,
      政宗: 0.5
    },

    // Q2
    {
      謙信: 1.0,
      信長: 0.5
    },

    // Q3
    {
      政宗: 1.0,
      信長: 0.5
    },

    // Q4
    {
      秀吉: 1.0,
      政宗: 0.5
    },

    // Q5
    {
      秀吉: 1.0,
      家康: 0.5
    },

    // Q6
    {
      政宗: 1.0,
      秀吉: 0.5
    },

    // Q7
    {
      家康: 1.0,
      信玄: 0.5
    },

    // Q8
    {
      信玄: 1.0,
      家康: 0.5
    },

    // Q9
    {
      家康: 1.0,
      信玄: 0.5
    },

    // Q10
    {
      謙信: 1.0,
      信長: 0.5
    },

    // Q11
    {
      謙信: 1.0,
      信玄: 0.5
    },

    // Q12
    {
      信長: 1.0,
      謙信: 0.5
    },

    // Q13
    {
      政宗: 1.0,
      信長: 0.5
    },

    // Q14
    {
      信長: 1.0,
      政宗: 0.5
    },

    // Q15
    {
      政宗: 1.0,
      信玄: 0.5
    }

  ];


  const currentScores =
    questionScores[
      questionIndex
    ];


  for (
    const warrior
    in currentScores
  ) {

    scores[warrior] +=
      point *
      currentScores[warrior];

  }

}


// ========================================
// 結果を表示
// ========================================

function showResult() {

  let bestType =
    "信長";

  let bestScore =
    -1;


  // 一番点数が高い武将を探す

  for (
    const warrior
    in scores
  ) {

    if (
      scores[warrior] >
      bestScore
    ) {

      bestScore =
        scores[warrior];

      bestType =
        warrior;

    }

  }


  // ========================================
  // 武将データ
  // ========================================

  const resultData = {

    信長: {

      name:
        "織田信長タイプ",

      description:
        "新しいことに挑戦する大胆さと、強い決断力を持つタイプです。",

      image:
        "images/oda.jpeg"

    },


    秀吉: {

      name:
        "豊臣秀吉タイプ",

      description:
        "人とのつながりを大切にし、周囲の力を引き出すのが得意なタイプです。",

      image:
        "images/hideyoshi.jpeg"

    },


    家康: {

      name:
        "徳川家康タイプ",

      description:
        "じっくり考え、長期的な視点で物事を進めるタイプです。",

      image:
        "images/ieyasu.jpeg"

    },


    信玄: {

      name:
        "武田信玄タイプ",

      description:
        "冷静な分析力と戦略性を持ち、計画的に物事を進めるタイプです。",

      image:
        "images/shingen.jpeg"

    },


    謙信: {

      name:
        "上杉謙信タイプ",

      description:
        "自分の信念を大切にし、筋を通して行動するタイプです。",

      image:
        "images/kenshin.jpeg"

    },


    政宗: {

      name:
        "伊達政宗タイプ",

      description:
        "個性的な発想と行動力を持ち、大きな目標に挑戦するタイプです。",

      image:
        "images/masamune.jpeg"

    }

  };


  const data =
    resultData[bestType];


  // ========================================
  // 結果画面
  // ========================================

  result.className =
    "result-" + bestType;


  resultType.textContent =
    data.name;


  resultDescription.textContent =
    data.description;


  resultImage.src =
    data.image;


  // 画像がまだない場合は
  // 信長画像を表示

  resultImage.onerror =
    function () {

      this.src =
        "images/oda.jpeg";

    };


  // 性格グラフ

  showPersonalityScores();


  // クイズ画面を隠す

  quiz.style.display =
    "none";


  // ========================================
  // 結果発表演出
  // ========================================

  resultEffect.style.display =
    "flex";


  setTimeout(
    function () {

      resultEffect.style.display =
        "none";


      result.style.display =
        "block";


      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    },
    2200
  );

}


// ========================================
// 性格傾向グラフ
// ========================================

function showPersonalityScores() {

  const maxScore =
    15;


  setPersonalityBar(
    "innovationScore",
    "innovationBar",
    axisScores.innovation,
    maxScore
  );


  setPersonalityBar(
    "socialScore",
    "socialBar",
    axisScores.social,
    maxScore
  );


  setPersonalityBar(
    "carefulScore",
    "carefulBar",
    axisScores.careful,
    maxScore
  );


  setPersonalityBar(
    "beliefScore",
    "beliefBar",
    axisScores.belief,
    maxScore
  );


  setPersonalityBar(
    "individualScore",
    "individualBar",
    axisScores.individual,
    maxScore
  );

}


// ========================================
// 性格グラフを設定
// ========================================

function setPersonalityBar(
  scoreId,
  barId,
  score,
  maxScore
) {

  const scoreElement =
    document.getElementById(
      scoreId
    );


  const barElement =
    document.getElementById(
      barId
    );


  if (
    !scoreElement ||
    !barElement
  ) {

    return;

  }


  const percent =
    Math.round(
      (score / maxScore) *
      100
    );


  scoreElement.textContent =
    percent + "%";


  barElement.style.width =
    percent + "%";

}


// ========================================
// 性格グラフをリセット
// ========================================

function resetPersonalityBars() {

  const scoreIds = [

    "innovationScore",
    "socialScore",
    "carefulScore",
    "beliefScore",
    "individualScore"

  ];


  const barIds = [

    "innovationBar",
    "socialBar",
    "carefulBar",
    "beliefBar",
    "individualBar"

  ];


  scoreIds.forEach(
    function (id) {

      const element =
        document.getElementById(id);

      if (element) {

        element.textContent =
          "0%";

      }

    }
  );


  barIds.forEach(
    function (id) {

      const element =
        document.getElementById(id);

      if (element) {

        element.style.width =
          "0%";

      }

    }
  );

}


// ========================================
// もう一度診断する
// ========================================

restartButton.addEventListener(
  "click",
  function () {

    // ----------------------------
    // 得点をリセット
    // ----------------------------

    resetScores();

    currentQuestion = 0;


    // ----------------------------
    // 結果画面を消す
    // ----------------------------

    result.style.display =
      "none";

    resultEffect.style.display =
      "none";


    // ----------------------------
    // スクロールを一番上へ
    // ----------------------------

    window.scrollTo({

      top: 0,

      behavior: "instant"

    });


    // ----------------------------
    // 再スタート演出
    // ----------------------------

    if (restartEffect) {

      restartEffect.classList.remove(
        "hide"
      );

      restartEffect.classList.remove(
        "show"
      );

      restartEffect.style.display =
        "flex";

      void restartEffect.offsetWidth;

      restartEffect.classList.add(
        "show"
      );

    }


    // ----------------------------
    // 約1.8秒後
    // スタート画面へ戻る
    // ----------------------------

    setTimeout(
      function () {

        if (restartEffect) {

          restartEffect.classList.remove(
            "show"
          );

        }


        // スタート画面表示

        startScreen.style.display =
          "block";


        // スタート画面の
        // 再登場アニメーション

        startScreen.classList.remove(
          "returnAppear"
        );

        void startScreen.offsetWidth;

        startScreen.classList.add(
          "returnAppear"
        );


        // ----------------------------
        // プログレスバーをリセット
        // ----------------------------

        progressFill.style.width =
          "6.67%";


        // ----------------------------
        // 性格グラフをリセット
        // ----------------------------

        resetPersonalityBars();


        // ----------------------------
        // 少し後に演出を完全に消す
        // ----------------------------

        setTimeout(
          function () {

            if (restartEffect) {

              restartEffect.classList.remove(
                "hide"
              );

              restartEffect.style.display =
                "none";

            }

          },
          800
        );

      },
      1800
    );

  }
);