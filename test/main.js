/** @@ import, export **/
import { log, tmpl } from "./comm.js";

/** @@ Class  **/
class User {
    constructor() {
        this.getUserList();
        this.registerEvents();
        this.userInfo = new Map();
        this.userList = new Map();
        this.histList = new WeakMap();
    }

    //사용자목록 조회(전체)
    getUserList() {
        const dataURL = "./test/data/data.json";
        const oReq = new XMLHttpRequest();
        oReq.addEventListener("load", () => {
            const list = JSON.parse(oReq.responseText);

            list.users.forEach((v, i) => {
                //console.log(v, i);
                this.userList.set(v.id, v);
            });

            log(this.userList);
        });
        oReq.open("GET", dataURL);
        oReq.send();
    }

    //이벤트 설정
    registerEvents() {
        const btn_login = document.querySelector("#btn_login");
        btn_login.addEventListener("click", (e) => {
            this.login();
        });

        const btn_logout = document.querySelector("#btn_logout");
        btn_logout.addEventListener("click", (e) => {
            this.logout();
        });

        const btn_leave = document.querySelector("#leave");
        btn_leave.addEventListener("click", (e) => {
            this.unRegisterUser();
        });
    }

    //로그인
    login() {
        const v_id = document.querySelector("#id").value;
        const v_pw = document.querySelector("#pw").value;

        if (!v_id || !v_pw) {
            alert("아이디와 비밀번호를 입력하세요.");
        } else {
            //const idx = this.userList.findIndex((e) => e.id == v_id);
            const myUser = this.userList.get(v_id);
            //console.log(myUser);
            if (!myUser) {
                alert("존재하지않는 사용자입니다.");
            } else {
                if (myUser.pw != v_pw) {
                    alert("비밀번호가 틀렸습니다.");
                } else if (myUser.activeYn.toUpperCase() != "Y") {
                    alert("해당 계정은 잠금되었습니다. 관리자에게 문의하세요.");
                } else {
                    this.userList = new Map(
                        /** @@ Array like (Array.from) **/
                        // Array.from(this.userList).filter(
                        //     ([k, v]) => v.lvl >= this.userInfo.lvl
                        // )

                        /** @@ spread  **/
                        [...this.userList].filter(
                            ([k, v]) => v.lvl >= myUser.lvl
                        )
                    );
                    // const filterList = this.userList.filter(
                    //     (v) => v.lvl >= this.userInfo.lvl
                    // );
                    this.userInfo = myUser;
                    this.setUserList();
                    this.setLoginHist();
                }
            }
        }
    }

    //사용자목록
    setUserList() {
        const v_div = document.querySelector("#middle > ul");
        v_div.innerHTML = "<li>아이디,이름,권한,취미</li>";
        this.userList.forEach((k) => {
            /** @@ tagged template literal **/
            v_div.innerHTML += tmpl`<li><span>${k.id}</span>
                                    ,<span>${k.name}</span>
                                    ,<span>${k.lvl}</span>
                                    ,<span>${k.hobby}</span></li>`;
        });

        document.getElementById("before_login").hidden = true;
        document.getElementById("after_login").hidden = false;

        document.getElementById("userNm").innerHTML = this.userInfo.name;
    }

    //로그인 카운트
    setLoginHist() {
        let count = this.histList.get(this.userList.get(this.userInfo.id)) || 0;
        this.histList.set(this.userList.get(this.userInfo.id), count + 1);
        document.getElementById("loginCnt").innerHTML = count + 1;
    }

    //탈퇴
    unRegisterUser() {
        /** @@ WeakMap vs Map **/

        if (!confirm("탈퇴하시겠습니까?")) return;
        //console.log(this.histList.get(this.userList.get(this.userInfo.id)));
        this.userList.delete(this.userInfo.id);
        //console.log(this.userList);
        //console.log(this.histList.get(this.userList.get(this.userInfo.id)));

        // WeakMap 은 불가능
        // for (const v of this.histList.values()) {
        //     console.log(v);
        // }
        this.setUserList();
        this.logout();
    }

    //로그아웃
    logout() {
        document.getElementById("before_login").hidden = false;
        document.getElementById("after_login").hidden = true;
        document.querySelector("#middle > ul").innerHTML = "";
        this.userInfo = null;
    }
}

export default User;
