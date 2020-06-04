echo $PWD;

Suitcase basic --name="HTML Goddess" --window-title="HTML Goddess" \
  --window-width="200" --window-height="200" \
  --icon="./html-xxl.png" \
  --working-directory="$PWD" \
  --control-type="label" \
  --control-title="Compiles all your source files to the \"docs\" dir" \
  --control-type="button" \
  --control-title="Print" \
  --control-action="/usr/local/bin/npm run print" \
  --control-action-destination="output" \
  --control-type="button" \
  --control-title="Save" \
  --control-action="/usr/local/bin/npm run save" \
  --control-action-destination="output" \
  --control-type="button" \
  --control-title="Publish" \
  --control-action="/usr/local/bin/npm run publish" \
  --control-action-destination="output" \
  --control-title="Console" \
  --control-type="text" \
  --control-identifier="output" \
  -E="PATH"
 