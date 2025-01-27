import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import LogoImg from "../images/skhuming_logo_ai.png";
import { Link } from "react-router-dom";

import { Container } from "../styles/DisplayBoardStyled.js";

import Marquee from "react-marquee-slider";

import AOS from "aos";
import "aos/dist/aos.css";

function DisplayBoard() {
    const [news, setNews] = useState([
        "김신아님이 명지우님을 추월하였습니다! (8등 → 7등)🎉🎉🎉",
        "명지우님이 최기웅님을 추월하였습니다! (10등 → 9등)🎉🎉🎉",
        "리액트님이 스프링님을 추월하였습니다! (120등 → 100등)🎉🎉🎉",
    ]);

    useEffect(() => {
        AOS.init(); // AOS 초기화
    }, []);

    return (
        <Container data-aos="flip-left" data-aos-duration="1000">
            <div className="board">
                <Marquee velocity={15}>
                    {news.map((text, index) => (
                        <div
                            key={index}
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            {text}
                        </div>
                    ))}
                </Marquee>
            </div>
        </Container>
    );
}

export default DisplayBoard;
