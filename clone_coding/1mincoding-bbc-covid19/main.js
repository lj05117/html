/*<스크립트로 해당되는 내용의 이미지만 보여주기> */
/*opacity:불투명도. visible 클래스가 붙은 애만 불투명도가 1이 돼서 그림이 보인다. */
/*스크롤 구간에 따라서 그래픽 아이템들의 visible 클래스를 붙였다 뗐다 하자. */
/*뭘 기준으로 visible을 붙일건가? 내용과 짝이 맞는게 중요하다. 각 step 클래스와 이미지에 인덱스를 붙여줘서 이미지와 말풍선의 짝을 맞춰준다.
스크롤 할 때 말풍선의 위치를 기준으로 어느정도 위치에 올라오면 그림을 맞춰준다.*/
/*전역변수 사용을 회피하기 위해서 즉시실행 익명 함수를 만든다 */