echo $PWD;

Suitcase basic --name="Demo App" --window-title="Hello World" \
  --window-width="200" --window-height="200" \
  --working-directory="$PWD" \
  --control-type="label" \
  --control-title="Start up your local server" \
  --control-type="button" \
  --control-title="🗣 Launch Site" \
  --control-action="source ~/.bash_profile && npm serve docs" \
  --control-action-destination="Terminal" \
  --control-title="Terminal" \
  --control-type="error-text" \
  --control-identifier="output" \
  -E="PATH"
 