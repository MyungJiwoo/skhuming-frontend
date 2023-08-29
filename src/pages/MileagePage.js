import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MainHeader from "../components/MainHeader.js";
import axios from "axios";
import PopUp from "../components/PopUp.js";

import tier_SS from "../images/tier_SS.png";
import tier_S from "../images/tier_S.png";
import tier_A from "../images/tier_A.png";
import tier_B from "../images/tier_B.png";
import tier_Un from "../images/tier_UN.png";
import MileageHistoryBox from "../components/MileageHistoryBox.js";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    .mileageBox {
        width: 50vw;
        margin: 10vh 0;
    }

    .mileageTitle > p,
    .mileageHistoryTitle > p {
        font-size: 30px;
        font-weight: bold;
        margin: 0;

        color: #2d6dcc;
    }

    .mileageHistoryTitle > p {
        margin-top: 15vh;
    }

    .mileageTitle > hr,
    .mileageHistoryTitle > hr {
        margin-bottom: 4vh;

        height: 3px;
        border: 0;
        background-color: #2d6dcc;
    }

    .userRankingBox {
        height: 21vh;
        margin-bottom: 4vh;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .userTierImg {
        width: 14vw;
        height: inherit;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .userTierImg > img {
        width: 8vw;
    }

    .userRanking {
        width: 28vw;
        height: inherit;
        padding: 0 4vw;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        border-radius: 0.625rem;
        background: #fbfbfb;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    }

    .userRanking > p {
        margin: 0;

        color: #2d6dcc;
        font-size: 1.3rem;
        font-weight: bold;
    }

    .ranking {
        width: inherit;

        display: flex;
        justify-content: space-between;
    }

    .ranking > p {
        margin: 0;
        margin-top: 3vh;

        color: #204782;
        font-size: 1.1rem;
    }

    .addMileageBox {
        width: inherit;
        height: 22vh;
        padding: 0 4vw;

        display: flex;
        flex-direction: column;
        justify-content: center;

        border-radius: 0.625rem;
        background: #fbfbfb;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    }

    .addMileageBox > p {
        margin: 0;
        margin-bottom: 3vh;

        color: #2d6dcc;
        font-size: 1.3rem;
        font-weight: bold;
    }

    .addMileage > form {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .skhumList {
        width: 44vw;
        padding: 1vh 1vw;

        border: none;
        border-radius: 0.85rem;
        background: #fff;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

        font-size: 1rem;
    }

    .skhumListBtn {
        width: 3vw;
        min-width: 45px;
        padding: 1vh;
        margin-left: 2vw;

        border: none;
        border-radius: 0.75rem;
        background: #3a73c9;

        color: #fff;
        font-size: 0.8rem;

        cursor: pointer;
    }

    .mileageHistoryBox {
        /* background-color: red; */
    }

    .nullMileage {
        font-size: 1.1rem;
        color: #204782;
    }
`;

function MileagePage() {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);

    const [popup, setPopup] = useState(false);
    const [msg, setMsg] = useState("");
    const [goLogin, setGoLogin] = useState(false);

    async function getUserData() {
        const memberId = window.localStorage.getItem("memberId");
        try {
            const response = await axios.get(
                "https://api.skhuming-api.store/user/api/mileage/get",
                {
                    params: { memberId: memberId },
                    headers: {
                        Authorization: window.localStorage.getItem("token"),
                    },
                }
            );
            setUserData(response.data);
            setLoading(true);
        } catch (error) {
            console.log(error.response.status);

            if (error.response.status === 401) {
                setMsg(error.response.data);
                setGoLogin(true);
            } else {
                setMsg(error.response.data.message);
            }

            setPopup(true);
        }
    }

    // 마일리지 점수 리스트 get
    const [mileageList, setMileageList] = useState([]);
    async function getMileageList() {
        try {
            const response = await axios.get(
                "https://api.skhuming-api.store/api/mileage/select-box"
            );
            setMileageList(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    // selectbox
    const [addMileage, setAddMileage] = useState("");

    const handleMileage = (event) => {
        setAddMileage(event.currentTarget.value);
        // console.log(event.currentTarget.value);
    };

    const submitMileage = (event) => {
        event.preventDefault();
        postMileage();
    };

    // 마일리지 추가 요청
    async function postMileage() {
        console.log(addMileage);
        try {
            const response = await axios.post(
                "https://api.skhuming-api.store/user/api/mileage/post",
                {
                    memberId: window.localStorage.getItem("memberId"),
                    mileageId: addMileage,
                },
                {
                    headers: {
                        Authorization: window.localStorage.getItem("token"),
                    },
                }
            );
            console.log(response);
            setMsg("🎉 스쿰 마일리지를 추가하였습니다!");
            setPopup(true);
        } catch (error) {
            if (error.response.status === 401) {
                setMsg(error.response.data);
                setGoLogin(true);
            } else {
                setMsg(error.response.data.message);
            }

            setPopup(true);
        }
    }

    // 마일리지 내역
    const [mileageHistory, setMileageHistory] = useState([]);
    async function getMileageHistory() {
        try {
            const response = await axios.get(
                "https://api.skhuming-api.store/user/api/mileage/history/list",
                {
                    params: {
                        memberId: window.localStorage.getItem("memberId"),
                    },
                    headers: {
                        Authorization: window.localStorage.getItem("token"),
                    },
                }
            );
            setMileageHistory(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserData();
        getMileageList();
        getMileageHistory();
    }, []);

    // 티어 사진
    function rankImg(tier) {
        switch (tier) {
            case "SS":
                return <img src={tier_SS} alt="tier"></img>;
            case "S":
                return <img src={tier_S} alt="tier"></img>;
            case "A":
                return <img src={tier_A} alt="tier"></img>;
            case "B":
                return <img src={tier_B} alt="tier"></img>;
            default:
                return <img src={tier_Un} alt="tier"></img>;
        }
    }

    return (
        <Container>
            <MainHeader />
            {popup ? (
                <PopUp onClose={setPopup} msg={msg} goLogin={goLogin} />
            ) : null}
            <div className="mileageBox">
                <div className="mileageTitle">
                    <p>MY MILEAGE</p>
                    <hr />
                </div>

                <div className="userMileageBox">
                    <div className="userRankingBox">
                        <div className="userTierImg">
                            {loading ? rankImg(userData.tier) : ""}
                        </div>
                        <div className="userRanking">
                            <p>MY RANKING</p>
                            <div className="ranking">
                                <p>{loading ? userData.nickname : ""}</p>
                                <p>{loading ? userData.score : ""}점</p>
                            </div>
                        </div>
                    </div>

                    <div className="addMileageBox">
                        <p>ADD MILEAGE</p>

                        <div className="addMileage">
                            <form>
                                <select
                                    className="skhumList"
                                    name="skhumList"
                                    onChange={handleMileage}
                                    value={addMileage}
                                >
                                    {mileageList.map((item) => (
                                        <option
                                            key={item.mileageId}
                                            value={item.mileageId}
                                        >
                                            {item.mileageScore !== 0
                                                ? `[${item.mileageScore}점] ${item.title}`
                                                : item.title}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="skhumListBtn"
                                    onClick={submitMileage}
                                >
                                    추가
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {mileageHistory.length !== 0 ? (
                    <div className="mileageHistoryTitle">
                        <p>MY MILEAGE HISTORY</p>
                        <hr />
                    </div>
                ) : null}

                <div className="mileageHistoryBox">
                    {mileageHistory ? (
                        mileageHistory.map((item) => (
                            <MileageHistoryBox
                                title={item.title}
                                mileageId={item.mileageId}
                                mileageScore={item.mileageScore}
                                systemDate={item.systemDate}
                            />
                        ))
                    ) : (
                        <p className="nullMileage">내역이 없습니다.</p>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default MileagePage;
