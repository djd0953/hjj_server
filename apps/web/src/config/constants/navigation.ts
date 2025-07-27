import { NAVIGATION_MENU_TYPE } from '@models/layout/navigation';

export const COMPONY_TITLE: string = 'COMPONY';

export const NAVIGATION_MENU: NAVIGATION_MENU_TYPE[] = [
    {
        group: 1,
        title: '회사소개',
        items: [
            {
                id: 1,
                title: '보기',
                href: '/read',
            },
            {
                id: 2,
                title: '기록',
                href: '/write',
            },
            {
                id: 3,
                title: '주요실적',
                href: '/',
            },
            {
                id: 4,
                title: '조직도',
                href: '/',
            },
            {
                id: 5,
                title: '인증서 및 특허',
                href: '/',
            },
            {
                id: 6,
                title: '홍보자료',
                href: '/',
            },
            {
                id: 7,
                title: '오시는길',
                href: '/',
            },
        ],
    },
    {
        group: 2,
        title: '사업소개',
        items: [
            {
                id: 1,
                title: '조기경보시스템',
                href: '/',
            },
            {
                id: 2,
                title: '둔치주차장침수알림시스템',
                href: '/',
            },
            {
                id: 3,
                title: '재난예경보시스템',
                href: '/',
            },
            {
                id: 4,
                title: '자동기상관측시스템',
                href: '/',
            },
            {
                id: 5,
                title: '자동강우관측시스템',
                href: '/',
            },
            {
                id: 6,
                title: '자동수위관측시스템',
                href: '/',
            },
            {
                id: 7,
                title: '소하천 스마트 계측관리시스템',
                href: '/',
            },
            {
                id: 8,
                title: '무선마을방송시스템',
                href: '/',
            },
        ],
    },
    {
        group: 3,
        title: '제품소개',
        items: [
            {
                id: 1,
                title: '강우량계',
                href: '/',
            },
            {
                id: 2,
                title: '수위계',
                href: '/',
            },
            {
                id: 3,
                title: '적설계',
                href: '/',
            },
            {
                id: 4,
                title: 'AWS',
                href: '/',
            },
            {
                id: 5,
                title: '마을방송시스템',
                href: '/',
            },
            {
                id: 6,
                title: '미세먼지전광판',
                href: '/',
            },
            {
                id: 7,
                title: '미세먼지신호등',
                href: '/',
            },
        ],
    },
    {
        group: 4,
        title: '인재채용',
        items: [
            {
                id: 1,
                title: '인재상',
                href: '/',
            },
        ],
    },
];
