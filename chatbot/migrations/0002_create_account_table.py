from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(unique=True, max_length=254)),
                ('phone', models.CharField(max_length=20)),
                ('role', models.CharField(choices=[('admin','Admin'),('technical','Technical Admin'),('support','Customer Service'),('finance','Finance/Accounting')], default='support', max_length=20)),
                ('password', models.CharField(max_length=128)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'accounts',
                'ordering': ['-created_at'],
            },
        ),
    ]
