param (
    [string]$EnvFile = ".env"
)

# Load the .env file
if (Test-Path $EnvFile)
{
    Get-Content $EnvFile |
            ForEach-Object {
                if ($_ -notmatch '^#' -and $_.Trim() -ne "")
                {
                    $name, $value = $_ -split '=', 2
                    if ($name.Trim() -ne "")
                    {
                        [System.Environment]::SetEnvironmentVariable($name.Trim(),$value.Trim())
                    }
                }
            }
}

npm install

# Authorization URL
$AUTH_URL = "https://id.twitch.tv/oauth2/authorize?client_id=$env:CLIENT_ID&redirect_uri=$env:REDIRECT_URI&response_type=code&scope=chat:read%20chat:edit"

# Open the URL in the default browser
Write-Host "Opening browser for authorization..."
Start-Process "brave.exe" $AUTH_URL

# Run Python server to capture the code
Write-Host "Running local server to capture the authorization code..."
python311 scripts/auth_code_server.py

# Read the captured code
Write-Host "Waiting for authorization code..."
while (-Not (Test-Path auth_code.txt)) {
    Start-Sleep -Seconds 1
}
$AUTH_CODE = Get-Content auth_code.txt
Write-Host "Authorization code captured: $AUTH_CODE"

# Clean up
Remove-Item auth_code.txt

# Update the config file
Write-Host "Updating configuration..."
python311 scripts/update_config.py $AUTH_CODE $env:USERNAME $env:CLIENT_ID $env:CLIENT_SECRET $env:CHANNEL

npm start