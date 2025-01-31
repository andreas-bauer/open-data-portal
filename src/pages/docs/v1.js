import Head from 'next/head';
import {useEffect} from 'react'

import SwaggerUi from 'swagger-ui';
import "swagger-ui/dist/swagger-ui.css";

import config from 'src/lib/swagger-configs/v1.json';

export default function Docs() {
    useEffect(() => {
        SwaggerUi({
            dom_id: '#swaggerContainer',
            spec: config,
        });
    }, []);

    return (
        <div>
            <Head>
                <title>API Documentation v1</title>
            </Head>
            <div id={'swaggerContainer'} />
        </div>
    );
}
