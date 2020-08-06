import React from 'react';
import styled from 'styled-components';
import WalletInfo from './WalletPanel';

const HeaderFrame = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid black;
`;

const HeaderElement = styled.div`
    margin: 19px 30px;
    display: flex;
    min-width: 0;
    display: flex;
    align-items: center;
`;

const Title = styled.a`
    display: flex;
    text-decoration: none;
    align-items: center;
    cursor: pointer;
    height: 32px;
    img {
        font-size: 15px;
        font-weight: 500;
        height: 32px;
        width: 32px;
    }
`;

const AppName = styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
    margin-left: 12px;
`;

const Header = () => {
    return (
        <HeaderFrame>
            <HeaderElement>
                <Title href="/">
                    <img alt="nervos" src="nervos-logo.png" />
                    <AppName>Lumos Starter Pack</AppName>
                </Title>
            </HeaderElement>
            <HeaderElement>
                <WalletInfo />
            </HeaderElement>
        </HeaderFrame>
    );
};

export default Header;