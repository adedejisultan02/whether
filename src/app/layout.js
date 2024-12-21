export const metadata = {
    title: 'Whether',
    description: 'Your very own weather app',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{backgroundColor: 'rgb(247,231,230)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', background: 'white', fontSize: '15px'}}>
                    <p style={{color: 'red', margin: '0px'}}>WHETHER.IO</p>
                    <div style={{display: 'flex', gap: '13px'}}>
                        <p style={{margin: '0px'}}>Help</p>
                        <p style={{margin: '0px'}}>Sign Out</p>
                    </div>
                </div>
                <main>{children}</main>
            </body>
        </html>
    )
}