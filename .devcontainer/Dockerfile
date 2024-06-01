# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

ARG USER=vscode
ARG DEBIAN_FRONTEND=noninteractive
RUN usermod -s /usr/bin/zsh ${USER}

# VERSION can be either 'latest' or a specific version number
ARG VERSION=latest

EXPOSE 1313

USER ${USER}
ARG HOME=/home/${USER}
WORKDIR ${HOME}

ARG PNPM_HOME=${HOME}/.local/share/pnpm
ENV PATH="${PNPM_HOME}:$PATH"

RUN bash -c " \
    wget -qO- https://get.pnpm.io/install.sh | ENV=\"${HOME}/.zshrc\" SHELL=/bin/zsh sh - && \
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash && \
    export NVM_DIR=\"${HOME}/.nvm\" && \
    [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\" && \
    nvm install 20 && \
    nvm alias default 20 && \
    npm -g install @nestjs/cli && \
    pnpm env use -g 20 && \
    echo \"alias yarn='pnpm'\" >> ${HOME}/.zshrc && \
    echo \"alias npm='pnpm'\" >> ${HOME}/.zshrc && \
    echo \"export NVM_DIR='${HOME}/.nvm'\" >> ${HOME}/.zshrc && \
    echo \"[ -s '\$NVM_DIR/nvm.sh' ] && \. '\$NVM_DIR/nvm.sh'\" >> ${HOME}/.zshrc && \
    echo 'nvm use default' >> ${HOME}/.zshrc \
"

ARG OHMYZSH_HOME=${HOME}/.oh-my-zsh