import Board from './models/board';

//페이지네이션 실행
export default function createFakeData() {
  //0, 1, ... 39 로 이루어진 배열 생성 후 게시물 데이터로 변환
  const boards = [...Array(40).keys()].map(i => ({
    boardClass: 1,
    title: `게시물 #${i}`,
    content:
      'mongoDB가 설치된 folder에 가서 저 명령어에서 <dbuser>와 <dbpassword>를 설정' +
      '한 username과 password로 바꿔서 입력해 주면 해당 DB에 접속할 수 있습니다.mongoDB의 장점은 javascript 명령어를 그대로 사용할 수 있다는 점이죠. 하' +
      '지만 DB데이터 관련 함수들은 따로 익혀야 합니다.아래의 코드를 순서대로 입력해주면 기존의 데이터가 정리가 됩니다.[출처] [Node.js 강좌] 게시판 조회수, 게' +
      '시물 번호 추가|작성자 azure0777',
    category: '패션'
  }));

  Board.insertMany(boards, (err, docs) => {
    console.log(docs);
  });
}
