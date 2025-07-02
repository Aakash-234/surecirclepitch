import plotly.graph_objects as go
import json

# Parse the data
data = {
    "traditional_vs_sure_circle": {
        "traditional_insurance": {
            "premium_allocation": {"claims": 60, "overhead": 25, "commissions": 15},
            "cost_per_1000": 1000,
            "returns_if_no_claims": 0
        },
        "sure_circle": {
            "premium_allocation": {"claims": 85, "platform_fee": 10, "reserves": 5},
            "cost_per_1000": 700,
            "returns_if_no_claims": 300
        }
    }
}

# Extract data
traditional = data["traditional_vs_sure_circle"]["traditional_insurance"]
sure_circle = data["traditional_vs_sure_circle"]["sure_circle"]

# Calculate rupee amounts
trad_claims = (traditional["premium_allocation"]["claims"] / 100) * traditional["cost_per_1000"]
trad_overhead = (traditional["premium_allocation"]["overhead"] / 100) * traditional["cost_per_1000"]
trad_commissions = (traditional["premium_allocation"]["commissions"] / 100) * traditional["cost_per_1000"]

sure_claims = (sure_circle["premium_allocation"]["claims"] / 100) * sure_circle["cost_per_1000"]
sure_platform = (sure_circle["premium_allocation"]["platform_fee"] / 100) * sure_circle["cost_per_1000"]
sure_reserves = (sure_circle["premium_allocation"]["reserves"] / 100) * sure_circle["cost_per_1000"]

# Create stacked bar chart with exact colors as requested
fig = go.Figure()

# Claims Coverage - Red for Traditional, Green for Sure Circle
fig.add_trace(go.Bar(
    name='Claims Coverage',
    x=['Traditional<br>₹1k Premium', 'Sure Circle<br>₹700 Premium'],
    y=[trad_claims, sure_claims],
    text=[f'<b>{traditional["premium_allocation"]["claims"]}%</b><br><b>₹{int(trad_claims)}</b>', 
          f'<b>{sure_circle["premium_allocation"]["claims"]}%</b><br><b>₹{int(sure_claims)}</b>'],
    textposition='inside',
    textfont=dict(size=14, color='white'),
    marker_color=['#B4413C', '#5D878F'],  # Red for traditional, green-cyan for sure circle
    cliponaxis=False
))

# Overhead/Platform Fee - Dark gray for Traditional, Blue for Sure Circle  
fig.add_trace(go.Bar(
    name='Overhead/Platform',
    x=['Traditional<br>₹1k Premium', 'Sure Circle<br>₹700 Premium'],
    y=[trad_overhead, sure_platform],
    text=[f'<b>{traditional["premium_allocation"]["overhead"]}%</b><br><b>₹{int(trad_overhead)}</b>', 
          f'<b>{sure_circle["premium_allocation"]["platform_fee"]}%</b><br><b>₹{int(sure_platform)}</b>'],
    textposition='inside',
    textfont=dict(size=14, color='white'),
    marker_color=['#4A4A4A', '#1FB8CD'],  # Dark gray for traditional, blue for sure circle
    cliponaxis=False
))

# Commissions/Reserve Fund - Orange for Traditional, Light blue for Sure Circle
fig.add_trace(go.Bar(
    name='Commissions/Reserve',
    x=['Traditional<br>₹1k Premium', 'Sure Circle<br>₹700 Premium'],
    y=[trad_commissions, sure_reserves],
    text=[f'<b>{traditional["premium_allocation"]["commissions"]}%</b><br><b>₹{int(trad_commissions)}</b>', 
          f'<b>{sure_circle["premium_allocation"]["reserves"]}%</b><br><b>₹{int(sure_reserves)}</b>'],
    textposition='inside',
    textfont=dict(size=14, color='black'),
    marker_color=['#FFC185', '#ECEBD5'],  # Orange for traditional, light blue/green for sure circle
    cliponaxis=False
))

# Update layout with correct axis title formatting
fig.update_layout(
    title=dict(
        text='<b>Why Sure Circle Delivers 3x Better Value</b>',
        font=dict(size=20, color='black')
    ),
    barmode='stack',
    yaxis=dict(
        title=dict(text='<b>Amount (₹)</b>', font=dict(size=14)),
        tickformat='.0f'
    ),
    xaxis=dict(
        title=dict(text='<b>Insurance Model</b>', font=dict(size=14))
    ),
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    uniformtext_minsize=12,
    uniformtext_mode='hide'
)

# Add prominent returns comparison box
fig.add_shape(
    type="rect",
    x0=-0.45, y0=1050, x1=1.45, y1=1200,
    line=dict(color="#1FB8CD", width=3),
    fillcolor="#F0F8FF",
    opacity=0.9
)

# Add returns information text
fig.add_trace(go.Scatter(
    x=[0.5], y=[1125],
    text=['<b>Returns if No Claims:</b><br><b>Traditional: ₹0</b> | <b>Sure Circle: ₹300+</b><br><span style="color:#5D878F"><b>Sure Circle Returns Money Back!</b></span>'],
    mode='text',
    textfont=dict(size=16, color='black'),
    showlegend=False,
    cliponaxis=False
))

# Add premium savings highlight
fig.add_trace(go.Scatter(
    x=[0.5], y=[1300],
    text=['<b>Premium Savings: ₹300 | Returns: ₹300+ = ₹600+ Total Advantage</b>'],
    mode='text',
    textfont=dict(size=14, color='#5D878F'),
    showlegend=False,
    cliponaxis=False
))

fig.write_image('insurance_comparison_final.png')