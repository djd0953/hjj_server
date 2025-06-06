export default function Footer({className}: {className: string}) {
    return (
        <footer className="w-full bg-gray-100 text-sm text-gray-600 rounded-b-lg">
            <div className={className}>
                <div className="mx-auto max-w-screen-xl text-left sm:px-6 lg:px-8">
                    경기도 하남시 조정대로 45, 5층 F554호 (미사센텀비즈)<br />
                    Tel. 02-711-5332 / FAX. 02-711-5515<br />
                    COPYRIGHT ⓒ  2008 AKGC. ALLRIGHT RESERVED
                </div>
            </div>
        </footer>
    );
}
