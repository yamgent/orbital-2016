class AddSecondTutorialToTutorial < ActiveRecord::Migration
  def change
    add_column :tutorials, :has_second_tutorial, :boolean, default: false
    add_column :tutorials, :second_day, :integer
    add_column :tutorials, :second_start_time, :time
    add_column :tutorials, :second_end_time, :time
  end
end
