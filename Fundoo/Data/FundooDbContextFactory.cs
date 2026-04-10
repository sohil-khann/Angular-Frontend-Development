using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Fundoo.Data;

public class FundooDbContextFactory : IDesignTimeDbContextFactory<FundooDbContext>
{
    public FundooDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FundooDbContext>();
        optionsBuilder.UseSqlServer("Data Source=SOHIL-KHAN\\SQLEXPRESS;Database=FundooDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False;Command Timeout=30");
        return new FundooDbContext(optionsBuilder.Options);
    }
}
