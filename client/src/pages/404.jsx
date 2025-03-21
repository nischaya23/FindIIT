import React from 'react';

const NotFoundPage = () => {
    const styles = {
        page_404: {
            padding: '40px 0',
            background: '#fff',
            fontFamily: "'Arvo', serif",
        },
        container: {
            width: '100%',
            padding: '0 15px',
            marginRight: 'auto',
            marginLeft: 'auto',
        },
        row: {
            marginRight: '-15px',
            marginLeft: '-15px',
        },
        colSm12: {
            position: 'relative',
            minHeight: '1px',
            paddingRight: '15px',
            paddingLeft: '15px',
            width: '100%',
        },
        colSm10ColSmOffset1: {
            position: 'relative',
            minHeight: '1px',
            paddingRight: '15px',
            paddingLeft: '15px',
            width: '83.33333333%',
            marginLeft: '8.33333333%',
            textAlign: 'center',
        },
        four_zero_four_bg: {
            backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
            height: '400px',
            backgroundPosition: 'center',
        },
        h1: {
            fontSize: '80px',
            textAlign: 'center',
        },
        h3: {
            fontSize: '80px',
        },
        link_404: {
            color: '#fff',
            padding: '10px 20px',
            background: '#39ac31',
            margin: '20px 0',
            display: 'inline-block',
            textDecoration: 'none',
        },
        contant_box_404: {
            marginTop: '-50px',
        },
    };

    return (
        <section style={styles.page_404}>
            <div style={styles.container}>
                <div style={styles.row}>
                    <div style={styles.colSm12}>
                        <div style={styles.colSm10ColSmOffset1}>
                            <div style={styles.four_zero_four_bg}>
                                <h1 style={styles.h1}>404</h1>
                            </div>

                            <div style={styles.contant_box_404}>
                                <h3 style={styles.h3} className="h2">
                                    Look like you're lost
                                </h3>

                                <p>the page you are looking for not avaible!</p>

                                <a href="/" style={styles.link_404}>Go to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;