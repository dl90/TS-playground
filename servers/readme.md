# Servers

## auth

- uses NGINX with self signed certificate for TLS termination and custom domain name proxy
- custom domain name is resolved (DNS) in hosts file /etc/hosts

```bash
/usr/local/etc/nginx

# check config
sudo nginx -t

#self signed cert
openssl req -config openssl.conf -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout example.key.pem -out example.cert.pem



# ===============================
#         openssl.conf
# ===============================

[ req ]
default_bits        = 2048
default_keyfile     = key.pem
distinguished_name  = subject
req_extensions      = req_ext
x509_extensions     = x509_ext
string_mask         = utf8only

# The Subject DN can be formed using X501 or RFC 4514 (see RFC 4519 for a description).
#   Its sort of a mashup. For example, RFC 4514 does not provide emailAddress.
[ subject ]
countryName           = Country Name (2 letter code)
countryName_default   = CA

stateOrProvinceName         = State or Province Name (full name)
stateOrProvinceName_default = BC

localityName                = Locality Name (eg, city)
localityName_default        = Vancouver

organizationName            = Organization Name (eg, company)
organizationName_default    = dl90

organizationalUnitName         = Organizational Unit (eg, division)
organizationalUnitName_default = TS-playground

# Use a friendly name here because it's presented to the user. The server's DNS
#   names are placed in Subject Alternate Names. Plus, DNS names here is deprecated
#   by both IETF and CA/Browser Forums. If you place a DNS name here, then you
#   must include the DNS name in the SAN too (otherwise, Chrome and others that
#   strictly follow the CA/Browser Baseline Requirements will fail).
commonName              = Common Name (e.g. server FQDN or YOUR name)
commonName_default      = localhost

emailAddress            = Email Address
emailAddress_default    = test@example.com

# Section x509_ext is used when generating a self-signed certificate. I.e., openssl req -x509 ...
[ x509_ext ]

subjectKeyIdentifier      = hash
authorityKeyIdentifier    = keyid,issuer

# You only need digitalSignature below. *If* you don't allow
#   RSA Key transport (i.e., you use ephemeral cipher suites), then
#   omit keyEncipherment because that's key transport.
basicConstraints    = CA:FALSE
keyUsage            = digitalSignature, keyEncipherment
subjectAltName      = @alternate_names
nsComment           = "OpenSSL Generated Certificate"

# RFC 5280, Section 4.2.1.12 makes EKU optional
#   CA/Browser Baseline Requirements, Appendix (B)(3)(G) makes me confused
#   In either case, you probably only need serverAuth.
# extendedKeyUsage    = serverAuth, clientAuth

# Section req_ext is used when generating a certificate signing request. I.e., openssl req ...
[ req_ext ]

subjectKeyIdentifier    = hash

basicConstraints        = CA:FALSE
keyUsage                = digitalSignature, keyEncipherment
subjectAltName          = @alternate_names
nsComment               = "OpenSSL Generated Certificate"

# RFC 5280, Section 4.2.1.12 makes EKU optional
#   CA/Browser Baseline Requirements, Appendix (B)(3)(G) makes me confused
#   In either case, you probably only need serverAuth.
# extendedKeyUsage    = serverAuth, clientAuth

[ alternate_names ]

DNS.1       = local.test
DNS.2       = auth.local.test
DNS.3       = *.local.test

# Add these if you need them. But usually you don't want them or
#   need them in production. You may need them for development.
# DNS.5       = localhost
# DNS.6       = localhost.localdomain
# DNS.7       = 127.0.0.1

# IPv6 localhost
# DNS.8     = ::1



# ===============================
#           nginx.conf
# ===============================

#user  nobody;
worker_processes  1;

error_log  /usr/local/var/log/nginx/https-error.log;
error_log  /usr/local/var/log/nginx/https-notice.log notice;
error_log  /usr/local/var/log/nginx/https-info.log info;

#pid        logs/nginx.pid;

events {
    worker_connections  256;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen                      443 ssl;
        server_name                 auth.local.test local.test;

        ssl_certificate             full path to cert;
        ssl_certificate_key         full path to cert key;
        ssl_dhparam                 full path to diffie-hellman precomputed prime;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
        ssl_ecdh_curve secp384r1;
        ssl_session_cache shared:SSL:10m;
        # ssl_session_tickets off;
        # ssl_stapling on;
        # ssl_stapling_verify on;

        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block;";

        # handled by server (helmet)
        # add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";
        # add_header X-Content-Type-Options nosniff;
        # proxy_cookie_path / "/; secure; HttpOnly; SameSite=None;";

        location / {
            proxy_pass http://localhost:9999;
            proxy_set_header Host $host;
            proxy_http_version 1.1;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Host $server_name;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        # Proxy websocket connections (you probably don't need this)
        # location /ws {
        #     proxy_pass http://localhost:9999;
        #     proxy_http_version 1.1;
        #     proxy_set_header Upgrade $http_upgrade;
        #     proxy_set_header Connection "upgrade";
        # }
    }


    include servers/*;
}



# ===============================
#           /etc/hosts
# ===============================

##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##

127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost

127.0.0.1 local.test
127.0.0.1 auth.local.test

# Added by Docker Desktop
# To allow the same kube context to work on the host and the container:
127.0.0.1 kubernetes.docker.internal
# End of section

```
