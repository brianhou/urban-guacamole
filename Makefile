EXTENSION=sort-tabs

all: ${EXTENSION}.crx

${EXTENSION}.crx:
	google-chrome --pack-extension=${EXTENSION} --pack-extension-key=${EXTENSION}.pem

clean:
	rm ${EXTENSION}.crx
