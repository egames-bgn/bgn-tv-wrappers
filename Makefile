# ---- Common --------------------------------------------------------------
SHARED_DIR := $(CURDIR)/shared

# ---- Tizen ---------------------------------------------------------------
TIZEN_CERT_PROFILE ?= Buzztime_TizenCert
TIZEN_WGT_NAME     ?= BuzztimeTV_Tizen.wgt
TIZEN_DIR          := $(CURDIR)/tizen
# ---- Other Apps as we go -------------------------------------------------



.PHONY: tizen-clean tizen-build tizen-package tizen-all
tizen-clean:
	rm -rf $(TIZEN_DIR)/build $(TIZEN_DIR)/*.wgt

tizen-build:
	cp -r $(SHARED_DIR) $(TIZEN_DIR)/shared
	tizen build-web --build-dir $(TIZEN_DIR)/build -- $(TIZEN_DIR)

tizen-package: tizen-build
	tizen package --type wgt --sign $(TIZEN_CERT_PROFILE) -- $(TIZEN_DIR)/build
	mv $(TIZEN_DIR)/build/$(TIZEN_WGT_NAME) $(TIZEN_DIR)/

tizen-all: tizen-clean tizen-build tizen-package