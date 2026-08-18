/* ==========================================
   Announcement Checker
   script.js

   Version:
   Part 1 + Part 2
========================================== */

document.addEventListener("DOMContentLoaded", () => {

   const baseAnnouncement = `
      我々は！
ぽぴぃ がぽぴぽびぽぴっ と受験に勝って戻ってくるまで！
ひたすらに侍ち続ける！

@ぽぴぃの後継者よしきゅー。に続け！!！
   `;

   /* ==========================================
      Maintenance Mode
   ========================================== */

   const maintenanceMode = false;

   if (maintenanceMode) {

    document.body.innerHTML = `
        <div class="maintenance-screen">

            <h1>🔧 メンテナンス中</h1>

            <p>
                現在、アナウンス照合ツールは
                メンテナンスを実施しています。
            </p>

            <p>
                ご不便をお掛けしますが、
                復旧までしばらくお待ちください。
            </p>

        </div>
    `;

    return;

}

    /* ==========================================
       Elements
    ========================================== */

   
    const originalText =
        document.getElementById("originalText");

    const compareText =
        document.getElementById("compareText");
   

    const rightCount =
        document.getElementById("rightCount");


    const pasteRight =
        document.getElementById("pasteRight");

    const clearRight =
        document.getElementById("clearRight");


    const themeToggle =
        document.getElementById("themeToggle");


    const toast =
        document.getElementById("toast");


    const compareBtn =
        document.getElementById("compareBtn");


    const loading =
        document.getElementById("loading");


    const matchRate =
        document.getElementById("matchRate");


    const progressBar =
        document.getElementById("progressBar");

   　let diffResult = {
      　added:0,
      　removed:0,
      　changed:0
   　};

    originalText.textContent =
    baseAnnouncement.trim();

    /* ==========================================
       Toast
    ========================================== */

    function showToast(message){

        toast.textContent = message;

        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove("show");

        },2000);

    }



    /* ==========================================
       Character Counter
    ========================================== */

   function updateCounter(){

    rightCount.textContent =
        `${compareText.value.length}文字`;

   }

    compareText.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();



    /* ==========================================
       Clipboard Paste
    ========================================== */

    async function pasteText(target){


        try{

            const text =
                await navigator.clipboard.readText();


            target.value = text;


            updateCounter();


            showToast("貼り付けました");

        }

        catch(error){

            showToast(
                "貼り付けできませんでした"
            );

        }

    }

    pasteRight.addEventListener(
        "click",
        () => pasteText(compareText)
    );



    /* ==========================================
       Clear
    ========================================== */

    function clearText(target){


        target.value = "";


        updateCounter();


        showToast("クリアしました");

    }

    clearRight.addEventListener(
        "click",
        () => clearText(compareText)
    );



    /* ==========================================
       Theme
    ========================================== */


    const savedTheme =
        localStorage.getItem("theme");


    if(savedTheme === "dark"){

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️";

    }
    else{

        themeToggle.textContent = "🌙";

    }



    themeToggle.addEventListener(
        "click",
        () => {


            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            if(isDark){

                localStorage.setItem(
                    "theme",
                    "dark"
                );


                themeToggle.textContent =
                    "☀️";


                showToast(
                    "ダークモード"
                );

            }

            else{

                localStorage.setItem(
                    "theme",
                    "light"
                );


                themeToggle.textContent =
                    "🌙";


                showToast(
                    "ライトモード"
                );

            }


        }
    );



    /* ==========================================
       Compare
    ========================================== */


    function compareAnnouncement(){

        const text1 =
          baseAnnouncement.trim();

      　const text2 =
          compareText.value.trim();
       
       diffView.innerHTML = "";

      diffSummary.textContent =
          "変更はありません";


      matchRate.textContent =
          "0%";


      progressBar.style.width =
          "0%";


      diffResult = {

          added:0,

          removed:0,

          changed:0

      };

        if(
            text1 === "" ||
            text2 === ""
        ){

            showToast(
                "文章を入力してください"
            );

            return;

        }



        loading.classList.remove(
            "hidden"
        );



        setTimeout(() => {


            const score =
               calculateSimilarity(
                  text1,
                  text2
            );


            displayScore(score);


            generateDiff(
                text1,
                text2
            );

            loading.classList.add(
                "hidden"
            );


        },800);


    }



    /* ==========================================
       Similarity
    ========================================== */
function calculateSimilarity(text1, text2){

    if(text1 === text2){
        return 100;
    }

    const chars1 = Array.from(text1);
    const chars2 = Array.from(text2);

    const dp = Array.from(
        { length: chars1.length + 1 },
        () => Array(chars2.length + 1).fill(0)
    );

    for(let i = 1; i <= chars1.length; i++){

        for(let j = 1; j <= chars2.length; j++){

            if(chars1[i - 1] === chars2[j - 1]){

                dp[i][j] =
                    dp[i - 1][j - 1] + 1;

            }else{

                dp[i][j] =
                    Math.max(
                        dp[i - 1][j],
                        dp[i][j - 1]
                    );

            }

        }

    }

    const commonLength =
        dp[chars1.length][chars2.length];

    const maxLength =
        Math.max(
            chars1.length,
            chars2.length
        );

    if(maxLength === 0){
        return 100;
    }

    return Math.round(
        (commonLength / maxLength) * 100
    );

}
   
    /* ==========================================
       Display Score
    ========================================== */


    function displayScore(score){


        matchRate.textContent =
            `${score}%`;



        progressBar.style.width =
            `${score}%`;



        if(score === 100){

            showToast(
                "完全一致しました"
            );

        }
        else{

            showToast(
                "照合完了"
            );

        }

    }

   /* ==========================================
   LCS (Longest Common Subsequence)
========================================== */

function getLCS(a, b){

    const dp = Array.from(
        { length: a.length + 1 },
        () => Array(b.length + 1).fill(0)
    );

    for(let i = 1; i <= a.length; i++){

        for(let j = 1; j <= b.length; j++){

            if(a[i - 1] === b[j - 1]){

                dp[i][j] = dp[i - 1][j - 1] + 1;

            }else{

                dp[i][j] = Math.max(
                    dp[i - 1][j],
                    dp[i][j - 1]
                );

            }

        }

    }

    return dp;

}
   
   /* ==========================================
   Diff Viewer
   ========================================== */

   const diffView =
      document.getElementById("diffView");

   const diffSummary =
      document.getElementById("diffSummary");

function generateDiff(text1, text2){

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");

    const dp = getLCS(lines1, lines2);

    let i = lines1.length;
    let j = lines2.length;

    const diff = [];

    while(i > 0 || j > 0){

        // 同じ行
        if(
            i > 0 &&
            j > 0 &&
            lines1[i - 1] === lines2[j - 1]
        ){

            diff.unshift({
                type: "normal",
                text: lines1[i - 1],
                number: i
            });

            i--;
            j--;

        }

        // 追加
        else if(
            j > 0 &&
            (
                i === 0 ||
                dp[i][j - 1] >= dp[i - 1][j]
            )
        ){

            diff.unshift({
                type: "add",
                text: "+ " + lines2[j - 1],
                number: j
            });

            j--;

        }

        // 削除
        else{

            diff.unshift({
                type: "remove",
                text: "- " + lines1[i - 1],
                number: i
            });

            i--;

        }

    }


    let html = "";

    let added = 0;
    let removed = 0;
    let changed = 0;


    for(let k = 0; k < diff.length; k++){

        const current = diff[k];
        const next = diff[k + 1];


        /*
         * 削除 → 追加
         *
         * 単純な追加・削除ではなく
         * 「変更」として扱う
         */

        if(
            current &&
            current.type === "remove" &&
            next &&
            next.type === "add"
        ){

            changed++;

            html += createDiffLine(
                current.number,
                current.text,
                "remove"
            );

            html += createDiffLine(
                next.number,
                next.text,
                "change"
            );

            k++;

        }


        // 追加

        else if(current.type === "add"){

            added++;

            html += createDiffLine(
                current.number,
                current.text,
                "add"
            );

        }


        // 削除

        else if(current.type === "remove"){

            removed++;

            html += createDiffLine(
                current.number,
                current.text,
                "remove"
            );

        }


        // 通常

        else{

            html += createDiffLine(
                current.number,
                current.text,
                "normal"
            );

        }

    }


    diffView.innerHTML = html;


    diffResult.added = added;
    diffResult.removed = removed;
    diffResult.changed = changed;


    diffSummary.textContent =
        `追加 ${added}件 / 削除 ${removed}件 / 変更 ${changed}件`;

}
   
function createDiffLine(
    number,
    text,
    type
){


    return `

    <div class="diff-line diff-${type}">

        <span class="line-number">
            ${number}
        </span>


        <span class="line-content">
            ${escapeHTML(text)}
        </span>


    </div>

    `;


}



function escapeHTML(text){

    return text
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");

}

    compareBtn.addEventListener(
        "click",
        compareAnnouncement
    );

/* ==========================================
   Copy Result
========================================== */


const copyResult =
    document.getElementById("copyResult");



copyResult.addEventListener(
    "click",
    async()=>{


        const resultText =

`アナウンス照合結果

一致率：
${matchRate.textContent}

追加：
${diffResult.added}件

削除：
${diffResult.removed}件

変更：
${diffResult.changed}件


----------------

${diffView.innerText}
`;



        try{

            await navigator.clipboard.writeText(
                resultText
            );


            showToast(
                "結果をコピーしました"
            );

        }

        catch(error){

            showToast(
                "コピーできませんでした"
            );

        }


    }
  );
   
});
