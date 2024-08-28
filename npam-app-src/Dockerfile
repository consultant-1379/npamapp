FROM armdocker.rnd.ericsson.se/proj_oss_releases/enm/base-ui

#=========================================================================
# Installing application
#=========================================================================

ENV APP_DIR "/ericsson/npam-app"

COPY . ${APP_DIR}/

WORKDIR ${APP_DIR}

RUN npm install request body-parser

RUN find -name .cdt | xargs rm -rf \
    && find . -type f -exec dos2unix {} \; \
    && ./install.sh \
    && ./link-packages.sh

EXPOSE 8585

HEALTHCHECK CMD curl http://localhost:8585

ENTRYPOINT  ["./start.sh"]
