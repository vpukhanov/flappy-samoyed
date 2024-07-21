FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY res/ /usr/share/nginx/html/res/
