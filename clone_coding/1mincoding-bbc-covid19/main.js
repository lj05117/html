/*<스크립트로 해당되는 내용의 이미지만 보여주기> */
/*opacity:불투명도. visible 클래스가 붙은 애만 불투명도가 1이 돼서 그림이 보인다. */
/*스크롤 구간에 따라서 그래픽 아이템들의 visible 클래스를 붙였다 뗐다 하자. */
/*뭘 기준으로 visible을 붙일건가? 내용과 짝이 맞는게 중요하다. 각 step 클래스와 이미지에 인덱스를 붙여줘서 이미지와 말풍선의 짝을 맞춰준다.
스크롤 할 때 말풍선의 위치를 기준으로 어느정도 위치에 올라오면 그림을 맞춰준다.*/
/*전역변수 사용을 회피하기 위해서(함수 안에서 지역변수 만듦) 즉시실행 익명 함수(함수 이름이 없다고 익명함수라고 한다)를 만든다 */
/*전역변수는 누구나 접근할 수 있는 값이 되기 때문에 충돌 가능성도 있고 위험하다. js에서는 기본적으로 전역변수 사용은 피해주는게 좋다. */
(()=>{
    const actions={
        //birdFlies() 함수들을 actions라는 객체에 메서드로 등록한다.
        birdFlies(key) {
            if (key){
                document.querySelector('[data-index="2"] .bird').style.transform = `translateX(${window.innerWidth}px)`;
                //data-index를 부모로 가진 자식 bird을 window의 내부 폭 만큼 픽셀단위로 x축으로 움직일 수 있도록 설정.
                //translateX를 감싸는건 작은 따옴표가 아니다.
            } else{
                document.querySelector('[data-index="2"] .bird').style.transform = `translateX(-100%)`;
            }
        },
        birdFlies2(key) { //두번째 새 그림인 경우
            if (key){
                document.querySelector('[data-index="5"] .bird').style.transform = `translate(${window.innerWidth}px, ${-window.innerHeight * 0.7}px)`;
                //x, y 둘 다 지정하기 위해서 translate로 변경. 위쪽으로 날아가게 하기 위해서 -방향으로 가야한다.
            } else{
                document.querySelector('[data-index="5"] .bird').style.transform = `translateX(-100%)`;
            }
        }
    };

    const stepElems=document.querySelectorAll('.step');
    const graphicElems=document.querySelectorAll('.graphic-item');
    /*각 step들과 graphic-item들을 객체로 가져온다. */
    let currentItem=graphicElems[0]; // 현재 활성화된(visible 클래스가 붙은) .graphic-item을 지정하는 변수
    //스크롤을 내리기 전부터 첫번째 그림은 보이게 하기 위해서 미리 값을 설정해준다.
    let ioIndex;

    //IntersectionObserver 인스턴스를 만들어서 io에 넣고, 생성자를 호출해서, call back 함수가 들어간다. 함수 매개변수는 두개고, 
    const io=new IntersectionObserver((entries, observer)=>{
        //console.log(entries[0].target.dataset.index);
        //target은 div.step로, 해당되는 step의 index값을 콘솔창에 출력한다.
        //현재 체크된 index기준으로 바로 전 후의 위치를 체크하기 위함. 나타나고 사라지는 step의 인덱스가 모두 출력된다.
        ioIndex=entries[0].target.dataset.index*1;
        //숫자로 된 index값을 받아오기 위해서 곱하기 1을 해준다.
    });

    for (let i=0;i<stepElems.length;i++){
        io.observe(stepElems[i]);
        //io 인스턴스를 이용해서 관찰 시킨다. 모든 말풍선(step)들이 관찰대상으로 등록된다.
        //IntersectionObserver객체가 observe로 관찰하는 대상이 되는 객체들이 사라지거나 나타날때 callback 함수가 실행된다.

        //stepElems[i].setAttribute('data-index',i);
        stepElems[i].dataset.index=i; /*data-는 특별한 애라서 dataset객체가 미리 만들어져 있다.dataset은 HTML태그 안에 data-이런 식으로 속성이 들어간다고 생각하면 된다.
         data-의 뒤에 이름을 index로 할거니깐 속성을 index로 접근하면 된다.(다른이름으로 짓고 싶으면 index말고 다르게 적어도 됨)*/
        graphicElems[i].dataset.index=i;
        /*step과 grapic-item 쌍을 맞춰줌 */
    }

    //코드가 반복되지 않게 하기 위해 함수 생성
    function activate(action){
        currentItem.classList.add('visible');
        //currentItem에 visible 클래스를 붙여준다.
        if (action){
            actions[action] (true);
            //actions의 메서드(birdFlies)를 호출
        }
    }

    function inactivate(action){
        currentItem.classList.remove('visible');
        //이전 index 값의 이미지가 가진 visible 클래스를 없애준다.
        if (action){
            actions[action](false);
        }
    }

    window.addEventListener('scroll',()=>{
        //scroll 이벤트가 발생할때 실행되는 이벤트 핸들러 함수
        let step;
        //i 번째 stepElems를 변수로 사용하기 위해 만든 변수
        let boundingRect;

        //for (let i=0;i<stepElems.length;i++){ 
        //for 문을 불필요하게 너무 많이 돌리지 않기 위해서 현재의 index값을 기준으로 전, 후 index 만 고려하기 위한 for문 작성
        for (let i=ioIndex-1;i<ioIndex+2;i++){
            step=stepElems[i];
            if (!step) continue; //ioIndex가 0인 경우에 뜨는 에러를 방지하기 위해
            
            boundingRect=step.getBoundingClientRect();
            //console.log(boundingRect.top);
            //DOMRect라는 이름의 위치와 크기를 속성으로 가진 객체가 출력된다. 
            /*현재 아이템(step)의 top(혹은 y)위치가 측정 된다. */

            //boundingRect의 top이 브라우저 창 사이즈의 높이의 10%위치보다 크고 80%위치보다 작으면
            if(boundingRect.top>window.innerHeight*0.1 &&
                boundingRect.top<window.innerHeight*0.8){
                    console.log(step.dataset.index);
                    //몇번째 인덱스의 step이 등장했는지 확인하기 위해 콘솔창에 index 출력

                    //graphicElems[step.dataset.index].classList.add('visible');
                    //visible 클래스를 붙일 graphic-item(이미지)
                    //위 주석과 같이 코드를 짜면 visible 클래스를 붙이고 없애주지 않아서 이미지도 브라우저상에서 한 번 나타나게 되면 없어지지 않는다.

                    inactivate(currentItem.dataset.action);
                    /*if (currentItem){
                        inactivate();
                    }//if문을 써주지 않는 경우 맨 처음에는 currentItem 값이 없는 상태라서 에러 발생.
                    */

                    currentItem=graphicElems[step.dataset.index];
                    //currentItem에 조건에 맞는 step의 index를 가진 이미지를 넣어준다.
                    activate(currentItem.dataset.action);
                    //현재 활성화된 아이템의 dataset(data-)의 action
                }

        }//맨 처음 사진에 처음부터 visible 클래스를 적어줘도 되지만, 스크립트로 작성해보자
    })


    /*스크롤 된 값을 이용해서 수치로 계산해서 장면을 만드는 건 새로고침해도 문제가 없을 수 있지만, 우리 눈에 보이는 객체를 기준으로 처리하기 때문에 새로고침을 하면 제대로 갱신이 되지 않아 스크롤을 해야 작동한다.
    그래서 새로고침 했을 때 위로 올라가는 기능이 필요하다.*/
    window.addEventListener('load',()=>{  //새로고침하면 위로 올라가는 기능
        //문서가 load되면 실행된다.
        //늦춰줘야 잘 동작하기 때문에 setTimeout으로 함수로 만들어서, 0.1초 후에 실행되도록 한다.
        setTimeout(()=>scrollTo(0,0),100); //(x,y방향)
    })
    activate();
    //스크롤을 내리기 전에도 activate가 호출 돼서 첫번째 이미지가 보이게 된다.
})();
/*화살표 함수를 만들고 괄호로 감싸고, 괄호 연산자를 마지막에 붙여줘서 자동으로 실행되게 만들었다. */