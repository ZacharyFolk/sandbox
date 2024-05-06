Update the cert command:

```
 sudo certbot certonly --cert-name folk.codes --expand -d folk.codes -d api.folk.codes -d cagematch.folk.codes -d score-api.folk.codes -d disco.folk.codes -d disco-api.folk.codes -d wise-api.folk.codes
```

```
server {
    listen 443 ssl;
    server_name folk.codes;

    ssl_certificate /etc/letsencrypt/live/folk.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/folk.codes/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;

    root /var/www/main;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl;
    server_name api.folk.codes;

    ssl_certificate /etc/letsencrypt/live/folk.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/folk.codes/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;


    location / {
        proxy_pass http://localhost:9999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name cagematch.folk.codes;

    ssl_certificate /etc/letsencrypt/live/folk.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/folk.codes/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;

    root /var/www/cagematch;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl;
    server_name score-api.folk.codes;

    ssl_certificate /etc/letsencrypt/live/folk.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/folk.codes/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;


    location / {
        proxy_pass http://localhost:1999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name disco.folk.codes;

    ssl_certificate /etc/letsencrypt/live/folk.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/folk.codes/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;

    root /var/www/disco;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl;
    server_name disco-api.folk.codes;

    ssl_certificate /etc/letsencrypt/live/folk.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/folk.codes/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;


    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name wise-api.folk.codes;

    ssl_certificate /etc/letsencrypt/live/folk.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/folk.codes/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;


    location / {
        proxy_pass http://localhost:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
