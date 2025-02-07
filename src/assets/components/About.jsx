import React, { useState, useEffect } from 'react';
import classes from './About.module.css';

function About() {
    return (
        <div className={classes.aboutContainer}>
            <section className={classes.heroSection}>
                <div className={classes.overlay}>
                    <div className={classes.scrollableContainer}>
                        <h1 className={classes.heroContent}>About Us</h1>
                        <h2 className={classes.description}>A proud product, a satisfied customer</h2>
                        <p className={classes.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga porro molestias consectetur at, recusandae officia labore est placeat obcaecati. Saepe harum maiores delectus iure dicta? Ipsa obcaecati quam optio dolore.
                        Consequatur ipsam quisquam nostrum, beatae accusantium odio doloribus earum porro! Magnam facilis commodi eveniet dolorem totam corrupti quidem optio odio deserunt aspernatur, minus soluta, repellendus laboriosam illo tempore, explicabo distinctio.
                        Amet qui illo dolore obcaecati quasi non? Cum aliquam deserunt placeat, atque iusto voluptatum, exercitationem consectetur pariatur reiciendis id magni quas similique possimus suscipit aut qui. Velit deserunt laboriosam at. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi quisquam nemo reprehenderit laboriosam, tenetur iste. Possimus magnam consectetur eligendi nulla inventore voluptatem voluptas libero laudantium quisquam! Tenetur nisi iste nihil!
                        Cum repudiandae, provident accusantium doloribus vitae, in, illum asperiores harum vero ipsum dolor. Perspiciatis, nulla perferendis. Possimus laudantium modi tempore, praesentium voluptatem maiores reiciendis natus sint aliquam at saepe consectetur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem eum, amet illum fugit deserunt, voluptate labore rem accusantium repellendus perferendis minima quisquam culpa inventore cumque ad, quam temporibus distinctio! Quasi?</p>
                        <div className={classes.imageContainer}>
                            <div className={classes.images} style={{ background: `url(https://jayscotts.com/wp-content/uploads/2022/03/restaurant-patio-design-6-821x1024.jpg)` }} />
                            <div className={classes.images} style={{ background: `url(https://media.istockphoto.com/id/949988530/photo/modern-restaurant-terrace-in-the-summer.jpg?s=612x612&w=0&k=20&c=ddRUiyKEsrhRpTc7TRd4Op4GbSWnK2W-GARXF8ioenI=)` }} />
                            <div className={classes.images} style={{ background: `url(https://media.timeout.com/images/106108201/750/422/image.jpg)` }} />
                            <div className={classes.images} style={{ background: `url(https://www.statesman.com/gcdn/presto/2021/08/20/NA36/a6bda363-9c69-41ea-8d7d-eb46f4007907-summerhousesimonite.jpg?width=660&height=440&fit=crop&format=pjpg&auto=webp)` }} />
                            <div className={classes.images} style={{ background: `url(https://images.bauerhosting.com/celebrity/sites/3/2022/08/Screenshot-2022-08-04-at-15.30.40-1.png?auto=format&w=1440&q=80)` }} />
                            <div className={classes.images} style={{ background: `url(https://i.pinimg.com/736x/7e/6c/77/7e6c77d37f1c93cfa24bee5482147d41.jpg)` }} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default About;
