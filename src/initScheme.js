const mysql = require('mariadb');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: ''
});

async function createUserTable(conn) {
  // id, password 등의 조건은 insert할 때 처리
  // password는 sha-256으로 해싱되어 64자
  // name은 한글이 2byte이므로 varchar(20)은 10글자 저장가능
  await conn.query(
    'create table if not exists user (id varchar(20), password char(64), ' +
      'address varchar(100), email varchar(50), name varchar(20), phone_number varchar(11), ' +
      'primary key(id));'
  );
  console.log('Create user table');
}

async function createPhotosTable(conn) {
  //한 게시물 당 사진 열개까지 저장 가능
  await conn.query(
    'create table if not exists photos (photo_id int auto_increment, url1 varchar(40), ' +
      'url2 varchar(40), url3 varchar(40), url4 varchar(40), url5 varchar(40), url6 varchar(40), ' +
      ' url7 varchar(40), url8 varchar(40), url9 varchar(40), url10 varchar(40), ' +
      'primary key(photo_id));'
  );
  console.log('Create photos table');
}

async function createBoardTable(conn) {
  // 기본 board, 게시판 별로 만들어야함
  // content는 링크를 저장, 링크 주소 줄이기(bitly, google URL shortener이용)
  await conn.query(
    'create table if not exists board (board_id int auto_increment, board_class int, ' +
      'title varchar(80), content varchar(40), post_date datetime, photo_id int, ' +
      'clicked_count int, category int, eval numeric(1,1), price numeric(10,2), duration varchar(50), ' +
      'primary key(board_id), foreign key(photo_id) references photos(photo_id));'
  );
  console.log('Create board table');
}

async function createTravelAppDB() {
  let conn, code;
  try {
    conn = await pool.getConnection();
    console.log('Initialized!');
    await conn.query('create database if not exists TravelApp;');
    console.log('Create TravelAppDB');
    await conn.query('use TravelApp;');
    createUserTable(conn);
    createPhotosTable(conn);
    createBoardTable(conn);
    code = 0;
  } catch (err) {
    code = 1;
  } finally {
    if (conn) {
      await conn.end();
      process.exit(code);
    }
  }
}
createTravelAppDB();
